import type { ITimeLruCache, SupportedCacheValues } from '@httpx/lru';
import { createStableKeyOrThrow } from '@httpx/stable-hash';

/*
type CacheKey = Record<string, unknown> | string | unknown[];

type ArgumentsTuple = readonly [any, ...unknown[]];
type Arguments =
  | string
  | ArgumentsTuple
  | Record<any, any>
  | null
  | undefined
  | false;
type Key = Arguments | (() => Arguments);
type StrictTupleKey = ArgumentsTuple | null | undefined | false;
type StrictKey = StrictTupleKey | (() => StrictTupleKey);

type FetcherResponse<Data = unknown> = Data | Promise<Data>;
type BareFetcher<Data = unknown> = (...args: any[]) => FetcherResponse<Data>;
type Fetcher<Data = unknown, SWRKey extends Key = Key> = SWRKey extends () =>
  | infer Arg
  | null
  | undefined
  | false
  ? (arg: Arg) => FetcherResponse<Data>
  : SWRKey extends null | undefined | false
    ? never
    : SWRKey extends infer Arg
      ? (arg: Arg) => FetcherResponse<Data>
      : never;

const lru = new TimeLruCache({
  maxSize: 50,
  defaultTTL: 1000,
});
*/

type CacheableValues = SupportedCacheValues;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CacheableAsyncFunction = (...args: any[]) => Promise<CacheableValues>;

type WithCacheParams<TFunction extends CacheableAsyncFunction> = {
  key: unknown[];
  fn: TFunction;
  ttl?: number;
};

export class XMemCache {
  #lru: ITimeLruCache;
  #keyPrefix?: string;
  constructor(options: { lru: ITimeLruCache; keyPrefix: string }) {
    const { lru, keyPrefix = '' } = options;
    this.#lru = lru;
    this.#keyPrefix = keyPrefix;
  }

  /**
   * Execute the provided async function if it's not in the cache, otherwise
   * return the cached value.
   *
   * @throw Error if the key is not a valid stable key.
   */
  withCache = async <TFunction extends CacheableAsyncFunction>(
    params: WithCacheParams<TFunction>
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
