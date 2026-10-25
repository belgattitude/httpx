import type { CacheCompressSuccessMeta } from "./compress/types";

/**
 * Time spent creating a cache entry on a cache miss (milliseconds).
 */
export type XMemCacheTimings = {
  /** Time taken by the cached function */
  fn: number;
  /**
   * Serialization time, absent when not serialized (ie: strings, no
   * compressor, or as reported by a custom compressor)
   */
  serialize?: number;
  /**
   * Compression time, absent when compression wasn't attempted. Present
   * when compression was skipped after compressing (ie: ratio not met).
   */
  compress?: number;
};

/**
 * Usage counters of a cache entry, updated in place on each use.
 */
export type XMemCacheEntryUsage = {
  /** Number of cache hits served by the entry */
  hits: number;
  /**
   * Number of concurrent calls that joined the execution that created the
   * entry (see the `dedupe` option)
   */
  deduped: number;
  /** Total time spent reading the entry on hits (decompress + deserialize) */
  readTime: number;
};

/**
 * Brand set on every value stored by XMemCache, used to recognize xcache
 * entries when the lru is shared with other code.
 * Symbol.for is used so that entries are recognized across multiple copies
 * of the package.
 */
const xMemCacheEntryBrand: unique symbol = Symbol.for(
  "@httpx/xcache:entry"
) as never;

/**
 * Value stored in the lru by XMemCache.
 *
 * - "compressed": serialized + compressed data with its compression meta.
 * - "native": the data as-is (no compressor, or compression skipped).
 */
export type XMemCacheEntry<T = unknown> = {
  [xMemCacheEntryBrand]: true;
  /** Creation time (epoch milliseconds) */
  createdAt: number;
  /** Time spent creating the entry (function, serialization, compression) */
  timings: XMemCacheTimings;
  /** Usage counters (hits, deduped calls, read time) */
  usage: XMemCacheEntryUsage;
  /**
   * Namespace of the cache key, undefined for an empty namespace or entries
   * created by older versions (shared lru).
   */
  namespace?: string;
} & (
  | {
      format: "compressed";
      /** Compressed data, Uint8Array for "binary" encoding, string for base64 */
      data: string | Uint8Array;
      /** How the data was compressed (algorithm, encoding, serializer, sizes) */
      meta: CacheCompressSuccessMeta;
    }
  | {
      format: "native";
      /** The cached data, stored as-is */
      data: T;
      /** When a compressor is set, the reason compression was skipped */
      meta?: { reason?: string | undefined };
    }
);

/**
 * Create a branded compressed entry to store in the lru.
 *
 * @param data - compressed data
 * @param meta - compression meta returned by the compressor
 * @param timings - time spent creating the entry
 */
export const createCompressedEntry = <T = unknown>(
  data: string | Uint8Array,
  meta: CacheCompressSuccessMeta,
  timings: XMemCacheTimings
): XMemCacheEntry<T> => {
  return {
    [xMemCacheEntryBrand]: true,
    createdAt: Date.now(),
    timings,
    usage: { hits: 0, deduped: 0, readTime: 0 },
    format: "compressed",
    data,
    meta,
  };
};

/**
 * Create a branded native (uncompressed) entry to store in the lru.
 *
 * @param data - the data to cache as-is
 * @param timings - time spent creating the entry
 * @param skippedReason - why compression was skipped, if a compressor is set
 */
export const createNativeEntry = <T>(
  data: T,
  timings: XMemCacheTimings,
  skippedReason?: string
): XMemCacheEntry<T> => {
  return {
    [xMemCacheEntryBrand]: true,
    createdAt: Date.now(),
    timings,
    usage: { hits: 0, deduped: 0, readTime: 0 },
    format: "native",
    data,
    ...(skippedReason === undefined ? {} : { meta: { reason: skippedReason } }),
  };
};

/**
 * Typeguard to check if a value stored in the lru was created by XMemCache.
 * Useful when the lru is shared with other code: values that aren't xcache
 * entries (even if they look alike) are rejected.
 *
 * @example
 * ```typescript
 * import { isXMemCacheEntry } from '@httpx/xcache';
 *
 * for (const [key, value] of lru) {
 *   if (isXMemCacheEntry(value)) {
 *     console.log(key, value.format);
 *   }
 * }
 * ```
 */
export const isXMemCacheEntry = <T = unknown>(
  value: unknown
): value is XMemCacheEntry<T> => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Partial<Record<PropertyKey, unknown>>;
  if (
    v[xMemCacheEntryBrand] !== true ||
    !("data" in v) ||
    typeof v.createdAt !== "number"
  ) {
    return false;
  }
  if (v.format === "native") {
    return true;
  }
  return (
    v.format === "compressed" &&
    (typeof v.data === "string" || v.data instanceof Uint8Array) &&
    typeof v.meta === "object" &&
    v.meta !== null
  );
};
