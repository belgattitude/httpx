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
  /** Async function to execute on cache miss */
  fn: (params: { key: TKey }) => Promise<TResult>;
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
    /** Generated cache key */
    generatedKey: CacheStringKey;
    /** Identifier of the compressor, when set */
    compressorId?: string;
    /** Set when the returned data was stored compressed */
    compression?: CacheCompressSuccessMeta;
  };
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
    } = options;
    this.#lru = lru;
    this.#defaultNs = namespace;
    this.#compressor = compressor;
    this.#compressorId = compressor?.getIdentifier() ?? undefined;
    this.#enabled = enabled;
    this.#compressionEnabled = compressionEnabled;
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
   */
  runAsync = async <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>
  ): Promise<Result<TResult>> => {
    // Hot path: the cache hit is resolved synchronously, without awaiting
    // another async function (each await adds a promise and a microtask)
    const generatedKey = this.#genKey(params);
    const enabled = params.enabled ?? this.#enabled;
    if (enabled && params.forceRevalidate !== true) {
      const entry = this.#getReadable<TResult>(generatedKey);
      if (entry !== undefined) {
        if (entry.format === "native") {
          return {
            data: entry.data,
            meta: this.#createMeta(true, false, generatedKey, undefined),
          };
        }
        return {
          data: await this.readEntry(entry),
          meta: this.#createMeta(true, false, generatedKey, entry.meta),
        };
      }
    }
    const { entry, data } = await this.#fetchAndStore(
      params,
      generatedKey,
      enabled
    );
    return {
      // on a miss, the function result is returned (not decompressed)
      data,
      meta: this.#createMeta(
        false,
        !enabled,
        generatedKey,
        entry.format === "compressed" ? entry.meta : undefined
      ),
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
   */
  runAsyncEntry = async <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>
  ): Promise<XMemCacheRunAsyncEntryResult<TResult>> => {
    const generatedKey = this.#genKey(params);
    const enabled = params.enabled ?? this.#enabled;
    let entry: XMemCacheEntry<TResult> | undefined;
    let cached = false;
    if (enabled && params.forceRevalidate !== true) {
      entry = this.#getReadable<TResult>(generatedKey);
      cached = entry !== undefined;
    }
    if (entry === undefined) {
      ({ entry } = await this.#fetchAndStore(params, generatedKey, enabled));
    }
    const result: XMemCacheRunAsyncEntryResult<TResult> = {
      entry,
      cached,
      bypassed: !enabled,
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
   * Execute the function and store its result (compressed when possible),
   * or only execute it when the cache is disabled (bypass).
   */
  readonly #fetchAndStore = async <
    TResult extends SupportedCacheValues,
    TKey extends CacheKeyTuple,
  >(
    params: XMemCacheRunAsyncParams<TResult, TKey>,
    generatedKey: CacheStringKey,
    enabled: boolean
  ): Promise<{ entry: XMemCacheEntry<TResult>; data: TResult }> => {
    const { fn, key, ttl } = params;
    const compressionEnabled =
      params.compressionEnabled ?? this.#compressionEnabled;
    const data = await fn({ key });
    if (!enabled) {
      return { entry: createNativeEntry(data), data };
    }
    let entry: XMemCacheEntry<TResult>;
    if (this.#compressor !== undefined && !compressionEnabled) {
      entry = createNativeEntry(data, "compression_disabled");
    } else if (
      this.#compressor !== undefined &&
      data !== null &&
      data !== undefined
    ) {
      const compressed = await this.#compressor.compress(data);
      entry =
        compressed.status === "success"
          ? createCompressedEntry(compressed.data, compressed.meta)
          : createNativeEntry(data, compressed.meta.reason);
    } else {
      entry = createNativeEntry(data);
    }
    // A replacement entry must be more recent than the one it replaces (ie:
    // forceRevalidate in the same millisecond), so that createdAt based
    // validators (ie: ETag) change when the content may have changed.
    const previous = this.#lru.peek(generatedKey);
    if (isXMemCacheEntry(previous) && entry.createdAt <= previous.createdAt) {
      entry.createdAt = previous.createdAt + 1;
    }
    this.#lru.set(generatedKey, entry, ttl);
    return { entry, data };
  };

  /**
   * Create the runAsync result meta (without object spreads, hot path).
   */
  readonly #createMeta = (
    cached: boolean,
    bypassed: boolean,
    generatedKey: CacheStringKey,
    compression: CacheCompressSuccessMeta | undefined
  ): Result<unknown>["meta"] => {
    const meta: Result<unknown>["meta"] = { cached, generatedKey };
    if (bypassed) {
      meta.bypassed = true;
    }
    if (this.#compressorId !== undefined) {
      meta.compressorId = this.#compressorId;
    }
    if (compression !== undefined) {
      meta.compression = compression;
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
