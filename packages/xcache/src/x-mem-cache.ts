import type { ITimeLruCache, SupportedCacheValues } from "@httpx/lru";

import {
  type CacheKeyTuple,
  type CacheStringKey,
  genCacheKeyString,
} from "./cache-key";
import type {
  CacheCompressorConfig,
  CacheCompressSuccessMeta,
  CacheDecompressTimings,
  ICacheCompressor,
} from "./compress/types";
import { elapsedSince, now, roundMs } from "./timing";
import {
  createCompressedEntry,
  createNativeEntry,
  isXMemCacheEntry,
  type XMemCacheEntry,
  type XMemCacheEntryUsage,
  type XMemCacheTimings,
} from "./x-mem-cache-entry";

/**
 * XMemCache constructor options.
 */
export type XMemCacheOptions = {
  /**
   * The lru used to store the cache entries (ie: TimeLruCache from @httpx/lru).
   * It can be shared with other code, values not created by XMemCache are
   * ignored.
   */
  lru: ITimeLruCache;
  /**
   * The default namespace is used to prefix the cache key,
   * allowing for separation of cache entries. If not provided,
   * it will use 'default'. The default namespace can be overridden
   * when calling `runAsync`.
   */
  namespace?: string;
  /**
   * Optional compressor (ie: CacheCompress) to reduce the memory used by
   * the cached data. Without compressor, data is stored as-is.
   */
  compressor?: ICacheCompressor;
  /**
   * Enable or disable the cache globally. When disabled, the function is
   * always executed and nothing is read or written to the cache. Can be
   * overridden per call (runAsync `enabled` param).
   *
   * @example
   * ```typescript
   * enabled: process.env.XCACHE_ENABLED !== 'false'
   * ```
   * @default true
   */
  enabled?: boolean;
  /**
   * Enable or disable compression globally (when a compressor is set). When
   * disabled, entries are stored as-is (same cache keys, existing compressed
   * entries can still be read). Can be overridden per call
   * (runAsync `compressionEnabled` param).
   *
   * @example
   * ```typescript
   * // ie: no compression in development
   * compressionEnabled: process.env.NODE_ENV === 'production'
   * ```
   * @default true
   */
  compressionEnabled?: boolean;
  /**
   * Share the in-flight function execution between concurrent calls having
   * the same generated key (cache stampede protection): on a cache miss, the
   * function is executed once and its result (or error) is returned to all
   * the callers. Can be overridden per call (runAsync `dedupe` param).
   * @default true
   */
  dedupe?: boolean;
};

/**
 * Parameters of XMemCache.runAsync and XMemCache.runAsyncEntry.
 */
export type XMemCacheRunAsyncParams<
  TResult extends SupportedCacheValues,
  TKey extends CacheKeyTuple,
> = {
  /** Cache key, first element must be a non-empty string */
  key: TKey;
  /**
   * Async function to execute on cache miss. The signal (when provided)
   * aborts when the call is aborted, or with dedupe when all the waiting
   * calls are aborted.
   */
  fn: (params: { key: TKey; signal?: AbortSignal }) => Promise<TResult>;
  /** Override the default namespace */
  namespace?: string;
  /** Time to live in milliseconds, defaults to the lru defaultTTL */
  ttl?: number;
  /** force a revalidation even if a cache entry exists */
  forceRevalidate?: boolean;
  /**
   * Enable or disable the cache for this call (overrides the global
   * `enabled` option). When disabled, the function is executed and the
   * cache is neither read nor written.
   */
  enabled?: boolean;
  /**
   * Enable or disable compression for this call (overrides the global
   * `compressionEnabled` option). When disabled, the entry is stored as-is.
   */
  compressionEnabled?: boolean;
  /**
   * Enable or disable the deduplication of concurrent calls for this call
   * (overrides the global `dedupe` option). When enabled, a call missing the
   * cache waits for the in-flight execution of the same key, if any. Calls
   * with `forceRevalidate` never wait for an in-flight execution, and
   * bypassed calls (cache disabled) are never deduplicated.
   */
  dedupe?: boolean;
  /**
   * Abort the call (ie: AbortController signal, AbortSignal.timeout()): the
   * call rejects with the signal reason as soon as it's aborted, even if the
   * function ignores the signal. Results of aborted executions are not
   * stored. With dedupe, the shared execution is only aborted when all the
   * waiting calls are aborted.
   */
  signal?: AbortSignal;
  /**
   * Origin of the call, added to the generated cache key to separate the
   * entries created by integrations (ie: "hono") from the ones created by
   * runAsync for the same key. Not set by default.
   */
  origin?: string;
};

/**
 * Result of XMemCache.runAsyncEntry.
 */
export type XMemCacheRunAsyncEntryResult<TResult> = {
  /** The stored entry (compressed or native) */
  entry: XMemCacheEntry<TResult>;
  /** Whether the entry was served from the cache */
  cached: boolean;
  /**
   * Whether the cache was bypassed (cache disabled globally or for this
   * call): the entry was created from the function result but not stored.
   */
  bypassed: boolean;
  /**
   * Whether the entry was created by the in-flight execution of a concurrent
   * call with the same key (see the `dedupe` option).
   */
  deduped: boolean;
  /** Generated cache key */
  generatedKey: CacheStringKey;
  /** Namespace of the cache key (undefined for an empty namespace) */
  namespace?: string;
  /**
   * Remaining time to live of the stored entry in milliseconds (undefined
   * when bypassed).
   */
  expiresIn?: number;
};

/**
 * Result of XMemCache.runAsync.
 */
type Result<TResult> = {
  /** The (cached) data returned by the function */
  data: TResult;
  /** Info about how the data was served */
  meta: {
    /** Whether the data was served from the cache */
    cached: boolean;
    /** Set when the cache was bypassed (disabled globally or for this call) */
    bypassed?: true;
    /**
     * Set when the data was returned by the in-flight execution of a
     * concurrent call with the same key (see the `dedupe` option)
     */
    deduped?: true;
    /** Generated cache key */
    generatedKey: CacheStringKey;
    /** Namespace of the cache key (undefined for an empty namespace) */
    namespace?: string;
    /** Identifier of the compressor, when set */
    compressorId?: string;
    /** Set when the returned data was stored compressed */
    compression?: CacheCompressSuccessMeta;
    /**
     * Time spent creating the entry on the cache miss (function,
     * serialization, compression). On a cache hit, the timings of the
     * execution that created the entry.
     */
    timings?: XMemCacheTimings;
    /**
     * Set on cache hits of compressed entries: time spent decompressing and
     * deserializing the data for this call (milliseconds).
     */
    readTimings?: CacheDecompressTimings;
  };
};

/**
 * Result of a function execution (entry stored in the lru and the function
 * result).
 */
type FetchResult<TResult> = {
  entry: XMemCacheEntry<TResult>;
  data: TResult;
};

/**
 * In-flight execution shared by concurrent calls (dedupe).
 */
type Inflight<TResult> = {
  promise: Promise<FetchResult<TResult>>;
  /** Aborts the execution, created when the first caller has a signal */
  controller: AbortController | undefined;
  /** Number of calls waiting for the execution */
  waiters: number;
};

/**
 * Return a promise rejecting with the signal reason as soon as it aborts,
 * without waiting for the provided promise.
 */
const raceAbort = async <T>(
  promise: Promise<T>,
  signal: AbortSignal | undefined,
  onAbort?: () => void
): Promise<T> => {
  if (signal === undefined) {
    return await promise;
  }
  let rejectAborted: ((reason: unknown) => void) | undefined;
  // oxlint-disable-next-line promise/avoid-new
  const aborted = new Promise<never>((_resolve, reject) => {
    rejectAborted = reject;
  });
  const listener = () => {
    onAbort?.();
    // the reason is kept as-is (ie: DOMException AbortError)
    rejectAborted?.(signal.reason);
  };
  signal.addEventListener("abort", listener, { once: true });
  try {
    return await Promise.race([promise, aborted]);
  } finally {
    signal.removeEventListener("abort", listener);
  }
};

/**
 * Info about a cache entry, returned by getEntryInfo and getStats.
 */
export type XMemCacheEntryInfo = {
  /** Generated cache key, as returned by runAsync in meta.generatedKey */
  key: CacheStringKey;
  /**
   * Namespace of the cache key, undefined for an empty namespace or entries
   * created by older versions (shared lru).
   */
  namespace?: string;
  /** "compressed" or "native" (stored as-is) */
  format: "native" | "compressed";
  /**
   * Size of the stored data for compressed entries (bytes for binary
   * encoding, chars for base64). Undefined for native entries as the size
   * of live objects can't be measured.
   */
  size?: number;
  /**
   * Size of the data before compression: serialized length (bytes for
   * binary serializers) or string length. Set for compressed entries, and
   * for native entries when it could be computed (ie: compression skipped
   * after serialization, strings, Uint8Array).
   */
  originalSize?: number;
  /** Compression meta, for compressed entries */
  compression?: CacheCompressSuccessMeta;
  /** Why compression was skipped (when a compressor is set) */
  skippedReason?: string;
  /** Creation time of the entry (epoch milliseconds) */
  createdAt: number;
  /**
   * Time spent creating the entry (function, serialization, compression),
   * undefined for entries created by older versions (shared lru).
   */
  timings?: XMemCacheTimings;
  /**
   * Usage of the entry since its creation, undefined for entries created by
   * older versions (shared lru).
   */
  usage?: {
    /** Number of cache hits served by the entry */
    hits: number;
    /** Number of concurrent calls that joined the creation execution */
    deduped: number;
    /** Average time spent reading the entry on hits (0 for native entries) */
    avgReadTime: number;
    /**
     * Estimated time saved in milliseconds: function time of hits and
     * deduped calls, minus the read time of hits and the time spent
     * serializing / compressing the entry. Can be negative.
     */
    savedTime: number;
  };
  /** Remaining time to live in milliseconds */
  expiresIn?: number;
};

/**
 * Totals of the XMemCache instance since its creation (or resetStats), kept
 * when entries expire or are cleared.
 */
export type XMemCacheTotals = {
  /** Calls served from the cache */
  hits: number;
  /** Calls that executed the function (cache enabled) */
  misses: number;
  /** Calls that joined the in-flight execution of a concurrent call */
  deduped: number;
  /** Calls that bypassed the cache (disabled globally or for the call) */
  bypassed: number;
  /**
   * Estimated time saved by the cache in milliseconds: function time of
   * hits and deduped calls, minus the read time of hits and the time spent
   * serializing / compressing on misses. Can be negative.
   */
  savedTime: number;
};

/**
 * Cache statistics, returned by getStats.
 */
export type XMemCacheStats = {
  /** Number of (non-expired) cache entries */
  items: number;
  /** Number of entries stored as-is (no compressor or compression skipped) */
  nativeItems: number;
  /** Number of compressed entries */
  compressedItems: number;
  /** Total size of the compressed entries */
  compressedSize: number;
  /** Total size of the compressed entries before compression (serialized) */
  originalSize: number;
  /**
   * Total original size of the native entries having one (see
   * XMemCacheEntryInfo.originalSize). Entries without measurable size (ie:
   * live objects stored without serialization) are not included.
   */
  nativeOriginalSize: number;
  /** Entries info, least recently used first */
  entries: XMemCacheEntryInfo[];
  /** Totals since the creation of the instance (or resetStats) */
  totals: XMemCacheTotals;
};

/**
 * XMemCache configuration, returned by getConfig.
 */
export type XMemCacheConfig = {
  /** Default namespace */
  namespace: string;
  /** Default time to live in milliseconds (lru defaultTTL) */
  ttl: number;
  /** Maximum number of entries (lru maxSize) */
  maxSize: number;
  /** Whether the cache is globally enabled */
  enabled: boolean;
  /** Whether compression is globally enabled (false without compressor) */
  compressionEnabled: boolean;
  /** Whether concurrent calls are deduplicated */
  dedupe: boolean;
  /**
   * The compressor, when set: its identifier and its configuration when
   * the compressor provides it (ie: CacheCompress).
   */
  compressor?: { id: string } & Partial<CacheCompressorConfig>;
};

/**
 * Size of the data when it can be computed without serializing (strings
 * and bytes).
 */
const getNativeSize = (data: unknown): number | undefined => {
  if (typeof data === "string") {
    return data.length;
  }
  return data instanceof Uint8Array ? data.byteLength : undefined;
};

/**
 * Time spent serializing and compressing an entry on the miss.
 */
const getStoreTime = (timings: XMemCacheTimings): number =>
  (timings.serialize ?? 0) + (timings.compress ?? 0);

/**
 * Convert the usage counters of an entry into its public info.
 */
const toUsageInfo = (
  usage: XMemCacheEntryUsage,
  timings: XMemCacheTimings
): NonNullable<XMemCacheEntryInfo["usage"]> => {
  const { hits, deduped, readTime } = usage;
  return {
    hits,
    deduped,
    avgReadTime: hits > 0 ? roundMs(readTime / hits) : 0,
    savedTime: roundMs(
      (hits + deduped) * timings.fn - readTime - getStoreTime(timings)
    ),
  };
};

/**
 * Create zeroed totals.
 */
const createTotals = (): XMemCacheTotals => {
  return { hits: 0, misses: 0, deduped: 0, bypassed: 0, savedTime: 0 };
};

/**
 * Convert a stored entry into its public info.
 */
const toEntryInfo = (
  key: CacheStringKey,
  value: XMemCacheEntry,
  expiresIn: number | undefined
): XMemCacheEntryInfo => {
  const ttl = {
    ...(typeof value.namespace === "string"
      ? { namespace: value.namespace }
      : {}),
    createdAt: value.createdAt,
    // entries created by older versions (shared lru) have no timings
    ...(typeof value.timings === "object" ? { timings: value.timings } : {}),
    ...(typeof value.usage === "object" && typeof value.timings === "object"
      ? { usage: toUsageInfo(value.usage, value.timings) }
      : {}),
    ...(expiresIn === undefined ? {} : { expiresIn }),
  };
  if (value.format === "compressed") {
    return {
      key,
      format: "compressed",
      size: value.meta.compressedSize,
      originalSize: value.meta.originalSize,
      compression: value.meta,
      ...ttl,
    };
  }
  const { reason, originalSize } = value.meta ?? {};
  return {
    key,
    format: "native",
    ...(originalSize === undefined ? {} : { originalSize }),
    ...(reason === undefined ? {} : { skippedReason: reason }),
    ...ttl,
  };
};

/**
 * Memory cache for async functions, with optional compression.
 *
 * @example
 * ```typescript
 * import { XMemCache, TimeLruCache } from '@httpx/xcache';
 *
 * const xMemCache = new XMemCache({
 *   lru: new TimeLruCache({ maxSize: 50, defaultTTL: 5000 }),
 * });
 * ```
 */
export class XMemCache {
  readonly #lru: ITimeLruCache;
  /**
   * Default namespace for the cache key.
   */
  readonly #defaultNs: string;
  readonly #compressor?: ICacheCompressor | undefined;
  readonly #compressorId?: string | undefined;
  readonly #enabled: boolean;
  readonly #compressionEnabled: boolean;
  readonly #dedupe: boolean;
  #totals: XMemCacheTotals = createTotals();
  /**
   * In-flight executions by generated key (dedupe).
   */
  readonly #inflight = new Map<CacheStringKey, Inflight<unknown>>();

  /**
   * @param options - lru, namespace, compressor and enabled options
   */
  constructor(options: XMemCacheOptions) {
    const {
      lru,
      compressor,
      namespace = "default",
      enabled = true,
      compressionEnabled = true,
      dedupe = true,
    } = options;
    this.#lru = lru;
    this.#defaultNs = namespace;
    this.#compressor = compressor;
    this.#compressorId = compressor?.getIdentifier() ?? undefined;
    this.#enabled = enabled;
    this.#compressionEnabled = compressionEnabled;
    this.#dedupe = dedupe;
  }

  /**
   * Whether the cache is globally enabled.
   */
  get enabled(): boolean {
    return this.#enabled;
  }

  /**
   * Whether compression is globally enabled (false without compressor).
   */
  get compressionEnabled(): boolean {
    return this.#compressor !== undefined && this.#compressionEnabled;
  }

  /**
   * Execute the provided async function if it's not in the cache, otherwise
   * return the cached value.
   *
   * @example
   * ```typescript
   * const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 5000 });
   * const xMemCache = new XMemCache({ lru });
   *
   * const asyncDataFetcher = async (params: { id: number }) => {
   *   return { id: params.id, data: `Data for ${params.id}` };
   * }
   *
   * const params: { id: number } = { id: 1 };
   *
   * const { data } = await xMemCache.runAsync({
   *  key: ['/api/data', params],
   *  fn: ({ key }) => asyncDataFetcher(params),
   * })
   * ```
   *
   * @throws TypeError if the key is not a valid stable key.
   * @throws the signal reason (ie: AbortError) when aborted.
   */
  runAsync = async <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>
  ): Promise<Result<TResult>> => {
    // Hot path: the cache hit is resolved synchronously, without awaiting
    // another async function (each await adds a promise and a microtask)
    params.signal?.throwIfAborted();
    const namespace = params.namespace ?? this.#defaultNs;
    const generatedKey = this.#genKey(params, namespace);
    const enabled = params.enabled ?? this.#enabled;
    if (enabled && params.forceRevalidate !== true) {
      const entry = this.#getReadable<TResult>(generatedKey);
      if (entry !== undefined) {
        if (entry.format === "native") {
          this.#trackHit(entry, 0);
          return {
            data: entry.data,
            meta: this.#createMeta(
              true,
              false,
              false,
              generatedKey,
              entry,
              namespace
            ),
          };
        }
        const readTimings: CacheDecompressTimings = {};
        const data = await this.readEntry<TResult>(entry, readTimings);
        const meta = this.#createMeta(
          true,
          false,
          false,
          generatedKey,
          entry,
          namespace
        );
        const { decompress, deserialize } = readTimings;
        if (decompress !== undefined || deserialize !== undefined) {
          meta.readTimings = readTimings;
        }
        this.#trackHit(entry, (decompress ?? 0) + (deserialize ?? 0));
        return { data, meta };
      }
    }
    const { entry, data, deduped } = await this.#fetchOrJoin(
      params,
      generatedKey,
      enabled
    );
    this.#trackMiss(entry, enabled, deduped);
    return {
      // on a miss, the function result is returned (not decompressed)
      data,
      meta: this.#createMeta(
        false,
        !enabled,
        deduped,
        generatedKey,
        entry,
        namespace
      ),
    };
  };

  /**
   * Return the data of an entry (ie: from runAsyncEntry), decompressed and
   * deserialized when compressed. When provided, timings is filled with the
   * time spent decompressing and deserializing (milliseconds).
   *
   * @throws TypeError if the entry is compressed and can't be decompressed
   * by the compressor of this instance.
   */
  readEntry = async <TResult>(
    entry: XMemCacheEntry<TResult>,
    timings?: CacheDecompressTimings
  ): Promise<TResult> => {
    if (entry.format === "native") {
      return entry.data;
    }
    if (this.#compressor === undefined) {
      throw new TypeError("Cannot read a compressed entry without compressor");
    }
    const data = await this.#compressor.decompress<TResult>(
      {
        status: "success",
        data: entry.data,
        meta: entry.meta,
      },
      timings
    );
    // rounded, as custom compressors may report more decimals
    if (timings?.decompress !== undefined) {
      timings.decompress = roundMs(timings.decompress);
    }
    if (timings?.deserialize !== undefined) {
      timings.deserialize = roundMs(timings.deserialize);
    }
    return data;
  };

  /**
   * Same as runAsync, but returns the stored cache entry as-is (compressed
   * data is not decompressed). Useful to send already compressed data
   * directly (ie: http responses with Content-Encoding).
   *
   * @example
   * ```typescript
   * const { entry, cached } = await xMemCache.runAsyncEntry({
   *   key: ['/api/data', params],
   *   fn: () => asyncDataFetcher(params),
   * });
   * if (entry.format === 'compressed') {
   *   // entry.data: compressed Uint8Array (or base64 string)
   *   // entry.meta: { algorithm, encoding, serializer, ... }
   * } else {
   *   // entry.data: the data as returned by fn
   * }
   * ```
   *
   * @throws TypeError if the key is not a valid stable key.
   * @throws the signal reason (ie: AbortError) when aborted.
   */
  runAsyncEntry = async <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>
  ): Promise<XMemCacheRunAsyncEntryResult<TResult>> => {
    params.signal?.throwIfAborted();
    const namespace = params.namespace ?? this.#defaultNs;
    const generatedKey = this.#genKey(params, namespace);
    const enabled = params.enabled ?? this.#enabled;
    let entry: XMemCacheEntry<TResult> | undefined;
    let cached = false;
    let deduped = false;
    if (enabled && params.forceRevalidate !== true) {
      entry = this.#getReadable<TResult>(generatedKey);
      cached = entry !== undefined;
    }
    if (entry === undefined) {
      ({ entry, deduped } = await this.#fetchOrJoin(
        params,
        generatedKey,
        enabled
      ));
      this.#trackMiss(entry, enabled, deduped);
    } else {
      // the entry is returned as-is: nothing to read
      this.#trackHit(entry, 0);
    }
    const result: XMemCacheRunAsyncEntryResult<TResult> = {
      entry,
      cached,
      bypassed: !enabled,
      deduped,
      generatedKey,
    };
    if (namespace !== "") {
      result.namespace = namespace;
    }
    const expiresIn = enabled ? this.#lru.expiresIn(generatedKey) : undefined;
    if (expiresIn !== undefined) {
      result.expiresIn = expiresIn;
    }
    return result;
  };

  /**
   * Update the usage of an entry and the totals on a cache hit.
   */
  readonly #trackHit = (entry: XMemCacheEntry, readTime: number): void => {
    const totals = this.#totals;
    totals.hits++;
    // entries created by older versions (shared lru) have no usage
    if (typeof entry.usage !== "object" || typeof entry.timings !== "object") {
      return;
    }
    entry.usage.hits++;
    entry.usage.readTime += readTime;
    totals.savedTime += entry.timings.fn - readTime;
  };

  /**
   * Update the usage of an entry and the totals when the function was
   * executed (or joined with dedupe).
   */
  readonly #trackMiss = (
    entry: XMemCacheEntry,
    enabled: boolean,
    deduped: boolean
  ): void => {
    const totals = this.#totals;
    if (!enabled) {
      totals.bypassed++;
    } else if (deduped) {
      totals.deduped++;
      entry.usage.deduped++;
      totals.savedTime += entry.timings.fn;
    } else {
      totals.misses++;
      totals.savedTime -= getStoreTime(entry.timings);
    }
  };

  /**
   * Generate the cache key of a runAsync / runAsyncEntry call.
   */
  readonly #genKey = <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>,
    namespace: string
  ): CacheStringKey =>
    genCacheKeyString({
      key: params.key,
      namespace,
      compressorId: this.#compressorId,
      origin: params.origin,
    });

  /**
   * Return the cached entry if it exists and can be read by this instance
   * (created by XMemCache, compatible compressor), otherwise undefined.
   */
  readonly #getReadable = <TResult>(
    generatedKey: CacheStringKey
  ): XMemCacheEntry<TResult> | undefined => {
    const existing = this.#lru.get(generatedKey);
    // ignore values not created by XMemCache (ie: shared lru)
    return isXMemCacheEntry<TResult>(existing) && this.#canRead(existing)
      ? existing
      : undefined;
  };

  /**
   * Execute the function and store its result, or wait for the in-flight
   * execution of a concurrent call with the same key (dedupe).
   */
  readonly #fetchOrJoin = async <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>,
    generatedKey: CacheStringKey,
    enabled: boolean
  ): Promise<FetchResult<TResult> & { deduped: boolean }> => {
    const { signal } = params;
    // bypassed calls behave as if there was no cache
    if (!enabled || !(params.dedupe ?? this.#dedupe)) {
      const result = await raceAbort(
        this.#fetchAndStore(params, generatedKey, enabled, signal),
        signal
      );
      return { ...result, deduped: false };
    }
    // a forced revalidation must not reuse an execution started before it
    if (params.forceRevalidate !== true) {
      const inflight = this.#inflight.get(generatedKey) as
        | Inflight<TResult>
        | undefined;
      if (inflight !== undefined) {
        const result = await this.#wait(inflight, generatedKey, signal);
        return { ...result, deduped: true };
      }
    }
    // the execution is shared: it's aborted when all the callers are
    const controller = signal === undefined ? undefined : new AbortController();
    const fetchAndRemove = async (inflight: Inflight<TResult>) => {
      try {
        return await this.#fetchAndStore(
          params,
          generatedKey,
          enabled,
          controller?.signal
        );
      } finally {
        // a forced revalidation may have replaced it in the meantime
        if (this.#inflight.get(generatedKey) === inflight) {
          this.#inflight.delete(generatedKey);
        }
      }
    };
    // Rejections are always handled: Promise.race in raceAbort keeps its
    // handlers even when all the callers have been aborted.
    const inflight = { controller, waiters: 0 } as Inflight<TResult>;
    inflight.promise = fetchAndRemove(inflight);
    this.#inflight.set(generatedKey, inflight);
    const result = await this.#wait(inflight, generatedKey, signal);
    return { ...result, deduped: false };
  };

  /**
   * Wait for an in-flight execution. When the last waiting call is aborted,
   * the execution is aborted and can't be joined anymore.
   */
  readonly #wait = <TResult>(
    inflight: Inflight<TResult>,
    generatedKey: CacheStringKey,
    signal: AbortSignal | undefined
  ): Promise<FetchResult<TResult>> => {
    inflight.waiters++;
    return raceAbort(inflight.promise, signal, () => {
      if (--inflight.waiters === 0) {
        inflight.controller?.abort(signal?.reason);
        if (this.#inflight.get(generatedKey) === inflight) {
          this.#inflight.delete(generatedKey);
        }
      }
    });
  };

  /**
   * Execute the function and store its result (compressed when possible),
   * or only execute it when the cache is disabled (bypass). Results of
   * aborted executions are not stored.
   */
  readonly #fetchAndStore = async <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>,
    generatedKey: CacheStringKey,
    enabled: boolean,
    signal: AbortSignal | undefined
  ): Promise<FetchResult<TResult>> => {
    const { fn, key, ttl } = params;
    const compressionEnabled =
      params.compressionEnabled ?? this.#compressionEnabled;
    const start = now();
    const data = await (signal === undefined
      ? fn({ key })
      : fn({ key, signal }));
    const timings: XMemCacheTimings = { fn: elapsedSince(start) };
    let entry: XMemCacheEntry<TResult>;
    if (!enabled) {
      entry = createNativeEntry(data, timings);
    } else if (this.#compressor !== undefined && !compressionEnabled) {
      entry = createNativeEntry(
        data,
        timings,
        "compression_disabled",
        getNativeSize(data)
      );
    } else if (
      this.#compressor !== undefined &&
      data !== null &&
      data !== undefined
    ) {
      const compressed = await this.#compressor.compress(data);
      // rounded, as custom compressors may report more decimals
      const { serialize, compress } = compressed.timings ?? {};
      if (serialize !== undefined) {
        timings.serialize = roundMs(serialize);
      }
      if (compress !== undefined) {
        timings.compress = roundMs(compress);
      }
      if (compressed.status === "success") {
        entry = createCompressedEntry(
          compressed.data,
          compressed.meta,
          timings
        );
      } else {
        const originalSize =
          compressed.status === "skipped"
            ? compressed.meta.originalSize
            : undefined;
        entry = createNativeEntry(
          data,
          timings,
          compressed.meta.reason,
          originalSize ?? getNativeSize(data)
        );
      }
    } else {
      entry = createNativeEntry(data, timings, undefined, getNativeSize(data));
    }
    const namespace = params.namespace ?? this.#defaultNs;
    if (namespace !== "") {
      entry.namespace = namespace;
    }
    // bypassed: the entry is not stored
    if (!enabled) {
      return { entry, data };
    }
    // A replacement entry must be more recent than the one it replaces (ie:
    // forceRevalidate in the same millisecond), so that createdAt based
    // validators (ie: ETag) change when the content may have changed.
    const previous = this.#lru.peek(generatedKey);
    if (isXMemCacheEntry(previous) && entry.createdAt <= previous.createdAt) {
      entry.createdAt = previous.createdAt + 1;
    }
    // ie: a function returning a fallback value when aborted
    if (signal?.aborted !== true) {
      this.#lru.set(generatedKey, entry, ttl);
    }
    return { entry, data };
  };

  /**
   * Create the runAsync result meta (without object spreads, hot path).
   */
  readonly #createMeta = (
    cached: boolean,
    bypassed: boolean,
    deduped: boolean,
    generatedKey: CacheStringKey,
    entry: XMemCacheEntry,
    namespace: string
  ): Result<unknown>["meta"] => {
    const meta: Result<unknown>["meta"] = { cached, generatedKey };
    if (namespace !== "") {
      meta.namespace = namespace;
    }
    if (bypassed) {
      meta.bypassed = true;
    }
    if (deduped) {
      meta.deduped = true;
    }
    if (this.#compressorId !== undefined) {
      meta.compressorId = this.#compressorId;
    }
    if (entry.format === "compressed") {
      meta.compression = entry.meta;
    }
    // entries created by older versions (shared lru) have no timings
    if (typeof entry.timings === "object") {
      meta.timings = entry.timings;
    }
    return meta;
  };

  /**
   * Return info about a cache entry, or undefined if not cached (or expired).
   * Does not affect the lru order.
   *
   * @example
   * ```typescript
   * const info = xMemCache.getEntryInfo({ key: ['/api/data', params] });
   * // { key: '{"key":[...],"ns":"default"}', format: 'compressed', size: 90333, compression: {...} }
   * ```
   *
   * @throws TypeError if the key is not a valid stable key.
   */
  getEntryInfo = <TKey extends CacheKeyTuple>(params: {
    /** Cache key, as provided to runAsync */
    key: TKey;
    /** Namespace, if overridden in runAsync */
    namespace?: string;
    /** Origin used when the entry was created (ie: "hono") */
    origin?: string;
  }): XMemCacheEntryInfo | undefined => {
    const cacheKey = genCacheKeyString({
      key: params.key,
      namespace: params.namespace ?? this.#defaultNs,
      compressorId: this.#compressorId,
      origin: params.origin,
    });
    const value = this.#lru.peek(cacheKey);
    return isXMemCacheEntry(value)
      ? toEntryInfo(cacheKey, value, this.#lru.expiresIn(cacheKey))
      : undefined;
  };

  /**
   * Return statistics about the entries stored in the lru (total items,
   * compressed sizes...), info for each entry (timings, usage...) and the
   * totals of the instance (hits, misses, saved time...).
   * Expired entries and values not created by XMemCache (shared lru) are
   * ignored, the lru order is not affected.
   *
   * Note that native (uncompressed) entries have no measurable size.
   * If the lru is shared, entries of other XMemCache instances are included.
   *
   * @example
   * ```typescript
   * const { items, compressedSize, originalSize, entries } = xMemCache.getStats();
   * ```
   */
  getStats = (): XMemCacheStats => {
    const stats: XMemCacheStats = {
      items: 0,
      nativeItems: 0,
      compressedItems: 0,
      compressedSize: 0,
      originalSize: 0,
      nativeOriginalSize: 0,
      entries: [],
      totals: {
        ...this.#totals,
        savedTime: roundMs(this.#totals.savedTime),
      },
    };
    for (const [key] of this.#lru) {
      // peek skips expired entries
      const value = this.#lru.peek(key);
      if (!isXMemCacheEntry(value)) {
        continue;
      }
      stats.items++;
      if (value.format === "compressed") {
        stats.compressedItems++;
        stats.compressedSize += value.meta.compressedSize;
        stats.originalSize += value.meta.originalSize;
      } else {
        stats.nativeItems++;
        stats.nativeOriginalSize += value.meta?.originalSize ?? 0;
      }
      stats.entries.push(
        toEntryInfo(key as CacheStringKey, value, this.#lru.expiresIn(key))
      );
    }
    return stats;
  };

  /**
   * A compressed entry can only be read by a compressor with the same
   * options (algorithm, encoding, serializer), otherwise it's a cache miss.
   */
  readonly #canRead = (entry: XMemCacheEntry): boolean => {
    if (entry.format !== "compressed") {
      return true;
    }
    if (this.#compressor === undefined) {
      return false;
    }
    return this.#compressor.isCompatible?.(entry.meta) ?? true;
  };

  /**
   * Return the configuration of the instance: default namespace and ttl,
   * enabled toggles and the compressor configuration (algorithm, encoding,
   * serializer...) when set.
   *
   * @example
   * ```typescript
   * const { ttl, compressor } = xMemCache.getConfig();
   * // compressor: { id: 'cache-compress:superjson', algorithm: 'gzip', encoding: 'binary', serializer: 'superjson', ... }
   * ```
   */
  getConfig = (): XMemCacheConfig => {
    const { defaultTTL, maxSize } = this.#lru.params;
    const config: XMemCacheConfig = {
      namespace: this.#defaultNs,
      ttl: defaultTTL,
      maxSize,
      enabled: this.#enabled,
      compressionEnabled: this.compressionEnabled,
      dedupe: this.#dedupe,
    };
    if (this.#compressor !== undefined) {
      config.compressor = {
        id: this.#compressorId ?? this.#compressor.getIdentifier(),
        ...this.#compressor.getConfig?.(),
      };
    }
    return config;
  };

  /**
   * Clear the cache and return the number of items removed. The totals
   * returned by getStats are kept (see resetStats).
   */
  clear = (): number => this.#lru.clear();

  /**
   * Remove the expired entries and return the number of items removed.
   * Expired entries are never served, but they're only removed from the lru
   * when accessed or evicted: use it to release their memory (ie: on an
   * interval). Values not created by XMemCache (shared lru) are kept.
   */
  clearExpired = (): number => {
    const expiredKeys: string[] = [];
    for (const [key, value] of this.#lru) {
      // expiresIn is undefined for expired entries
      if (isXMemCacheEntry(value) && this.#lru.expiresIn(key) === undefined) {
        expiredKeys.push(key);
      }
    }
    for (const key of expiredKeys) {
      this.#lru.delete(key);
    }
    return expiredKeys.length;
  };

  /**
   * Reset the totals returned by getStats (hits, misses, saved time...).
   * The usage of the entries is kept, it's reset when they're replaced.
   */
  resetStats = (): void => {
    this.#totals = createTotals();
  };
}
