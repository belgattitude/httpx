import type { ITimeLruCache, SupportedCacheValues } from '@httpx/lru';

import {
  type CacheKeyTuple,
  type CacheStringKey,
  genCacheKeyString,
} from './cache-key';
import type { ICacheCompressor } from './compress/types';

export type XMemCacheOptions = {
  lru: ITimeLruCache;
  /**
   * The default namespace is used to prefix the cache key,
   * allowing for separation of cache entries. If not provided,
   * it will use 'default'. The default namespace can be overridden
   * when calling `runAsync`.
   */
  namespace?: string;
  compressor?: ICacheCompressor;
};

type Result<TResult> = {
  data: TResult;
  meta: {
    cached: boolean;
    generatedKey: CacheStringKey;
    compressorId?: string;
  };
};

export class XMemCache {
  #lru: ITimeLruCache;
  /**
   * Default namespace for the cache key.
   */
  #defaultNs?: string;
  #compressor?: ICacheCompressor | undefined;
  #compressorId?: string | undefined;

  constructor(options: XMemCacheOptions) {
    const { lru, compressor, namespace = 'default' } = options;
    this.#lru = lru;
    this.#defaultNs = namespace;
    this.#compressor = compressor;
    this.#compressorId = compressor?.getIdentifier() ?? undefined;
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
  >(params: {
    key: TKey;
    fn: (params: { key: TKey }) => Promise<TResult>;
    namespace?: string;
    ttl?: number;
  }): Promise<Result<TResult>> => {
    const { fn, key, ttl, namespace } = params;

    const cacheKey = genCacheKeyString({
      key,
      namespace: namespace ?? this.#defaultNs,
      compressorId: this.#compressorId,
    });
    let cached = true;
    let data = this.#lru.get(cacheKey) as TResult | undefined;
    if (data === undefined) {
      cached = false;
      data = await fn({ key });
      if (
        this.#compressor !== undefined &&
        data !== null &&
        data !== undefined
      ) {
        const compressed = await this.#compressor.compress(data);
        this.#lru.set(cacheKey, compressed, ttl);
      } else if (data !== undefined) {
        this.#lru.set(cacheKey, data, ttl);
      }
    } else if (this.#compressor !== undefined && typeof data === 'string') {
      data = await this.#compressor.decompress<TResult>(data);
    }
    return {
      data,
      meta: {
        cached,
        generatedKey: cacheKey,
        ...(this.#compressorId === undefined
          ? {}
          : { compressorId: this.#compressorId }),
      },
    };
  };

  /**
   * Clear the cache and return the number of items removed.
   */
  clear = (): number => {
    return this.#lru.clear();
  };
}
