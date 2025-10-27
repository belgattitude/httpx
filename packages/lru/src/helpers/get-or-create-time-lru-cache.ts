import { TimeLruCache, type TimeLruCacheParams } from '../time-lru-cache';
import type { BaseCacheKeyTypes, SupportedCacheValues } from '../types';

type TimeLruCacheSingleInstanceName = string;

declare global {
  // eslint-disable-next-line no-var
  var __httpx_time_lru_cache_instances: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Map<TimeLruCacheSingleInstanceName, TimeLruCache<any, any>> | undefined;
}

type Options = {
  onCreate?: <
    TValue extends SupportedCacheValues = SupportedCacheValues,
    TKey extends BaseCacheKeyTypes = string,
  >(
    name: TimeLruCacheSingleInstanceName,
    params: TimeLruCacheParams<TValue, TKey>
  ) => void;
};

/**
 * Creates or retrieves a singleton LruCache instance by name
 * ensuring that only one instance exists for each unique name.
 *
 * This helper function relies on globalThis to store and retrieve
 * the instance.
 *
 * @example
 * ```typescript
 * import { getOrCreateTimeLruCache } from '@httpx/lru';
 *
 * const ttlLru = getOrCreateTimeLruCache('main-cache', { maxSize: 500 });
 * ```
 */
export const getOrCreateTimeLruCache = <
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
>(
  name: TimeLruCacheSingleInstanceName,
  lruCacheParams: TimeLruCacheParams<TValue, TKey>,
  options?: Options
): TimeLruCache<TValue, TKey> => {
  globalThis.__httpx_time_lru_cache_instances ??= new Map<
    TimeLruCacheSingleInstanceName,
    TimeLruCache
  >();
  if (!globalThis.__httpx_time_lru_cache_instances.has(name)) {
    if (options?.onCreate instanceof Function) {
      options.onCreate(name, lruCacheParams);
    }
    globalThis.__httpx_time_lru_cache_instances.set(
      name,
      new TimeLruCache<TValue, TKey>(lruCacheParams)
    );
  }
  return globalThis.__httpx_time_lru_cache_instances.get(name)! as TimeLruCache<
    TValue,
    TKey
  >;
};
