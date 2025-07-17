import type { ITimeLruCache } from '@httpx/lru';
import { createStableKeyOrThrow } from '@httpx/stable-hash';

import type {
  CacheableAsyncFunction,
  XCacheRunAsyncParams,
} from './x-cache.types';

export class XMemCache {
  #lru: ITimeLruCache;
  #keyPrefix?: string;
  constructor(options: { lru: ITimeLruCache; keyPrefix?: string }) {
    const { lru, keyPrefix = '' } = options;
    this.#lru = lru;
    this.#keyPrefix = keyPrefix;
  }

  /**
   * Execute the provided async function if it's not in the cache, otherwise
   * return the cached value.
   *
   * @example
   * ```typescript
   * const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 5000 });
   * const xMemCache = new XMemCache({ lru, keyPrefix: 'namespace1' });
   *
   * const asyncDataFetcher = async (params: { id: number }) => {
   *   return { id: params.id, data: `Data for ${params.id}` };
   * }
   *
   * const params: { id: number } = { id: 1 };
   *
   * const { data } = await xMemCache.runAsync({
   *  key: ['/api/data', params],
   *  fn: () => asyncDataFetcher(params),
   * })
   * ```
   *
   * @throws TypeError if the key is not a valid stable key.
   */
  runAsync = async <TFunction extends CacheableAsyncFunction>(
    params: XCacheRunAsyncParams<TFunction>
  ): Promise<{
    data: Awaited<ReturnType<TFunction>>;
  }> => {
    const { key, fn, ttl } = params;
    const cacheKey = `${this.#keyPrefix}${createStableKeyOrThrow(key)}`;
    let data = this.#lru.get(cacheKey);
    if (data === undefined) {
      data = await fn();
      this.#lru.set(cacheKey, data, ttl);
    }
    return {
      data: data as Awaited<ReturnType<TFunction>>,
    };
  };

  /**
   * Clear the cache and return the number of items removed.
   */
  clear = (): number => {
    return this.#lru.clear();
  };
}
