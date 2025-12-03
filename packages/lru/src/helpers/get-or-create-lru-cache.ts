import { LruCache, type LruCacheParams } from '../lru-cache';
import type { BaseCacheKeyTypes, SupportedCacheValues } from '../types';

type LruCacheSingleInstanceName = string;

declare global {
  // eslint-disable-next-line no-var
  var __httpx_lru_cache_instances: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<LruCacheSingleInstanceName, LruCache<any, any>> | undefined;
}

type Options = {
  onCreate?: <
    TValue extends SupportedCacheValues = SupportedCacheValues,
    TKey extends BaseCacheKeyTypes = string,
  >(
    name: LruCacheSingleInstanceName,
    params: LruCacheParams<TValue, TKey>
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
 * import { getOrCreateLruCache } from '@httpx/lru';
 *
 * const lru = getOrCreateLruCache('main-cache', { maxSize: 500 });
 * ```
 *
 * @warning The same name must always be used with consistent TValue and TKey types.
 *          Calling this function with different type parameters for the same name will cause
 *          type safety violations and unexpected behavior.
 */
export const getOrCreateLruCache = <
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
>(
  name: LruCacheSingleInstanceName,
  lruCacheParams: LruCacheParams<TValue, TKey>,
  options?: Options
): LruCache<TValue, TKey> => {
  globalThis.__httpx_lru_cache_instances ??= new Map<
    LruCacheSingleInstanceName,
    LruCache
  >();
  if (!globalThis.__httpx_lru_cache_instances.has(name)) {
    if (options?.onCreate instanceof Function) {
      options.onCreate(name, lruCacheParams);
    }
    globalThis.__httpx_lru_cache_instances.set(
      name,
      new LruCache<TValue, TKey>(lruCacheParams)
    );
  }
  return globalThis.__httpx_lru_cache_instances.get(name)! as LruCache<
    TValue,
    TKey
  >;
};
