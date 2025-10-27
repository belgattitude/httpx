import { LruCache, type LruCacheParams } from '../lru-cache';
import type { BaseCacheKeyTypes, SupportedCacheValues } from '../types';

type LruCacheSingleInstanceName = string;

declare global {
  // eslint-disable-next-line no-var
  var __httpx_lru_cache_instances:
    | Map<LruCacheSingleInstanceName, LruCache>
    | undefined;
}

globalThis.__httpx_lru_cache_instances = undefined;

export const getOrCreateLruCache = <
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
>(
  name: LruCacheSingleInstanceName,
  params: LruCacheParams<TValue, TKey>
): LruCache<TValue, TKey> => {
  globalThis.__httpx_lru_cache_instances ??= new Map<
    LruCacheSingleInstanceName,
    LruCache
  >();
  if (!globalThis.__httpx_lru_cache_instances.has(name)) {
    globalThis.__httpx_lru_cache_instances.set(
      name,
      new LruCache<TValue, TKey>(params)
    );
  }
  return globalThis.__httpx_lru_cache_instances.get(name)!;
};
