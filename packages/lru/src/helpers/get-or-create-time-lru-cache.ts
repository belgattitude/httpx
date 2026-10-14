import { TimeLruCache, type TimeLruCacheParams } from "../time-lru-cache";
import type { BaseCacheKeyTypes, SupportedCacheValues } from "../types";

type TimeLruCacheSingleInstanceName = string;

declare global {
  var __httpx_time_lru_cache_instances:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<TimeLruCacheSingleInstanceName, TimeLruCache<any, any>> | undefined;
}

export type GetOrCreateTimeLruCacheOptions = {
  onCreate?: <
    TValue extends SupportedCacheValues = SupportedCacheValues,
    TKey extends BaseCacheKeyTypes = string,
  >(
    name: TimeLruCacheSingleInstanceName,
    params: TimeLruCacheParams<TValue, TKey>
  ) => void;
};

/**
 * Creates or retrieves a singleton TimeLruCache instance by name
 * ensuring that only one instance exists for each unique name.
 *
 * This helper function relies on globalThis to store and retrieve
 * the instance.
 *
 * @example
 * ```typescript
 * import { getOrCreateTimeLruCache } from '@httpx/lru';
 *
 * const ttlLru = getOrCreateTimeLruCache('main-cache', { maxSize: 500, defaultTTL: 60000 });
 * ```
 *
 * @warning The same name must always be used with consistent TValue and TKey types.
 *          Calling this function with different type parameters for the same name will cause
 *          type safety violations and unexpected behavior.
 */
export const getOrCreateTimeLruCache = <
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
>(
  name: TimeLruCacheSingleInstanceName,
  lruCacheParams: TimeLruCacheParams<TValue, TKey>,
  options?: GetOrCreateTimeLruCacheOptions
): TimeLruCache<TValue, TKey> => {
  globalThis.__httpx_time_lru_cache_instances ??= new Map<
    TimeLruCacheSingleInstanceName,
    TimeLruCache
  >();
  let cache = globalThis.__httpx_time_lru_cache_instances.get(name);
  if (cache === undefined) {
    if (typeof options?.onCreate === "function") {
      options.onCreate(name, lruCacheParams);
    }
    cache = new TimeLruCache<TValue, TKey>(lruCacheParams);
    globalThis.__httpx_time_lru_cache_instances.set(name, cache);
  }
  return cache as TimeLruCache<TValue, TKey>;
};
