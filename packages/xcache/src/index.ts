export { CacheCompress } from "./compress/cache-compress";
export type {
  CacheCompressAlgorithm,
  CacheCompressContent,
  CacheCompressEncoding,
  CacheCompressorConfig,
  CacheCompressResult,
  CacheCompressSuccessMeta,
  CacheCompressTimings,
  CacheDecompressTimings,
  ICacheCompressor,
} from "./compress/types";
export { createCacheFn } from "./create-cache-fn";
// serializers requiring an optional peer dependency have their own entry
// (@httpx/xcache/superjson, /devalue, /cbor-x)
export { JsonSerializer } from "./serializer/json-serializer";
export type {
  ICacheBinarySerializer,
  ICacheSerializer,
  ICacheSerializerJsonDetection,
} from "./serializer/types";
export type {
  CacheableAsyncFunction,
  XCacheRunAsyncParams,
} from "./x-cache.types";
export type {
  XMemCacheConfig,
  XMemCacheDeleteParams,
  XMemCacheEntryInfo,
  XMemCacheLruOptions,
  XMemCacheOptions,
  XMemCacheRunAsyncEntryResult,
  XMemCacheRunAsyncParams,
  XMemCacheStats,
  XMemCacheTagInfo,
  XMemCacheTotals,
} from "./x-mem-cache";
export { XMemCache } from "./x-mem-cache";
export { isXMemCacheEntry } from "./x-mem-cache-entry";
export type {
  XMemCacheEntry,
  XMemCacheEntryUsage,
  XMemCacheTimings,
} from "./x-mem-cache-entry";
