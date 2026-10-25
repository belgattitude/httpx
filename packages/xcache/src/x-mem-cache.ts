import type { ITimeLruCache, SupportedCacheValues } from "@httpx/lru";

import {
  type CacheKeyTuple,
  type CacheStringKey,
  genCacheKeyString,
} from "./cache-key";
import type {
  CacheCompressSuccessMeta,
  ICacheCompressor,
} from "./compress/types";
import {
  createCompressedEntry,
  createNativeEntry,
  isXMemCacheEntry,
  type XMemCacheEntry,
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
    /** Identifier of the compressor, when set */
    compressorId?: string;
    /** Set when the returned data was stored compressed */
    compression?: CacheCompressSuccessMeta;
    /**
     * Time taken by the function to produce the data (milliseconds),
     * compression excluded. On a cache hit, the duration of the execution
     * that created the entry.
     */
    duration?: number;
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
 * High resolution time in milliseconds (Date.now() fallback).
 */
const now = (): number =>
  typeof performance === "undefined" ? Date.now() : performance.now();

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
  /** "compressed" or "native" (stored as-is) */
  format: "native" | "compressed";
  /**
   * Size of the stored data for compressed entries (bytes for binary
   * encoding, chars for base64). Undefined for native entries as the size
   * of live objects can't be measured.
   */
  size?: number;
  /** Compression meta, for compressed entries */
  compression?: CacheCompressSuccessMeta;
  /** Why compression was skipped (when a compressor is set) */
  skippedReason?: string;
  /** Creation time of the entry (epoch milliseconds) */
  createdAt: number;
  /**
   * Time taken by the function to produce the data (milliseconds),
   * compression excluded.
   */
  duration?: number;
  /** Remaining time to live in milliseconds */
  expiresIn?: number;
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
  /** Entries info, least recently used first */
  entries: XMemCacheEntryInfo[];
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
    createdAt: value.createdAt,
    // entries created by older versions (shared lru) have no duration
    ...(typeof value.duration === "number" ? { duration: value.duration } : {}),
    ...(expiresIn === undefined ? {} : { expiresIn }),
  };
  if (value.format === "compressed") {
    return {
      key,
      format: "compressed",
      size: value.meta.compressedSize,
      compression: value.meta,
      ...ttl,
    };
  }
  const reason = value.meta?.reason;
  return {
    key,
    format: "native",
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
  readonly #defaultNs?: string;
  readonly #compressor?: ICacheCompressor | undefined;
  readonly #compressorId?: string | undefined;
  readonly #enabled: boolean;
  readonly #compressionEnabled: boolean;
  readonly #dedupe: boolean;
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
    const generatedKey = this.#genKey(params);
    const enabled = params.enabled ?? this.#enabled;
    if (enabled && params.forceRevalidate !== true) {
      const entry = this.#getReadable<TResult>(generatedKey);
      if (entry !== undefined) {
        if (entry.format === "native") {
          return {
            data: entry.data,
            meta: this.#createMeta(true, false, false, generatedKey, entry),
          };
        }
        return {
          data: await this.readEntry(entry),
          meta: this.#createMeta(true, false, false, generatedKey, entry),
        };
      }
    }
    const { entry, data, deduped } = await this.#fetchOrJoin(
      params,
      generatedKey,
      enabled
    );
    return {
      // on a miss, the function result is returned (not decompressed)
      data,
      meta: this.#createMeta(false, !enabled, deduped, generatedKey, entry),
    };
  };

  /**
   * Return the data of an entry (ie: from runAsyncEntry), decompressed and
   * deserialized when compressed.
   *
   * @throws TypeError if the entry is compressed and can't be decompressed
   * by the compressor of this instance.
   */
  readEntry = async <TResult>(
    entry: XMemCacheEntry<TResult>
  ): Promise<TResult> => {
    if (entry.format === "native") {
      return entry.data;
    }
    if (this.#compressor === undefined) {
      throw new TypeError("Cannot read a compressed entry without compressor");
    }
    return await this.#compressor.decompress<TResult>({
      status: "success",
      data: entry.data,
      meta: entry.meta,
    });
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
    const generatedKey = this.#genKey(params);
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
    }
    const result: XMemCacheRunAsyncEntryResult<TResult> = {
      entry,
      cached,
      bypassed: !enabled,
      deduped,
      generatedKey,
    };
    const expiresIn = enabled ? this.#lru.expiresIn(generatedKey) : undefined;
    if (expiresIn !== undefined) {
      result.expiresIn = expiresIn;
    }
    return result;
  };

  /**
   * Generate the cache key of a runAsync / runAsyncEntry call.
   */
  readonly #genKey = <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>
  ): CacheStringKey =>
    genCacheKeyString({
      key: params.key,
      namespace: params.namespace ?? this.#defaultNs,
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
    const duration = Math.round((now() - start) * 100) / 100;
    if (!enabled) {
      return { entry: createNativeEntry(data, duration), data };
    }
    let entry: XMemCacheEntry<TResult>;
    if (this.#compressor !== undefined && !compressionEnabled) {
      entry = createNativeEntry(data, duration, "compression_disabled");
    } else if (
      this.#compressor !== undefined &&
      data !== null &&
      data !== undefined
    ) {
      const compressed = await this.#compressor.compress(data);
      entry =
        compressed.status === "success"
          ? createCompressedEntry(compressed.data, compressed.meta, duration)
          : createNativeEntry(data, duration, compressed.meta.reason);
    } else {
      entry = createNativeEntry(data, duration);
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
    entry: XMemCacheEntry
  ): Result<unknown>["meta"] => {
    const meta: Result<unknown>["meta"] = { cached, generatedKey };
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
    // entries created by older versions (shared lru) have no duration
    if (typeof entry.duration === "number") {
      meta.duration = entry.duration;
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
   * compressed sizes...) and info for each entry.
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
      entries: [],
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
   * Clear the cache and return the number of items removed.
   */
  clear = (): number => this.#lru.clear();
}
