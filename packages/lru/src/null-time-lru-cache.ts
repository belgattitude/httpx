import type { TimeLruCacheParams } from './time-lru-cache';
import type { ITimeLruCache } from './time-lru-cache.interface';
import type {
  BaseCacheKeyTypes,
  LruCacheHasOptions,
  Milliseconds,
  SupportedCacheValues,
} from './types';

export class NullTimeLruCache<
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
> implements ITimeLruCache<TValue, TKey> {
  /**
   * Create a new NullTimeLruCache (does cache nothing)
   *
   * @example
   * ```typescript
   * import { NullTimeLruCache } from '@httpx/lru';
   *
   * const lru = new NullTimeLruCache({ maxSize: 1000 });
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_params: TimeLruCacheParams<TValue, TKey>) {}

  readonly size = 0;
  readonly params = {
    maxSize: 0,
    defaultTTL: 0,
  };

  clear(): number {
    return 0;
  }

  has(_key: TKey, _options?: LruCacheHasOptions): boolean {
    return false;
  }

  set(_key: TKey, _value: TValue, _ttl?: Milliseconds): boolean {
    return false;
  }

  get(_key: TKey): undefined {
    return undefined;
  }

  getOrSet<T = TValue>(
    _key: TKey,
    valueOrFn: T | (() => T),
    _options?: {
      /**
       * Optional time to live for this specific item in milliseconds.
       * If not provided, the cache defaultTTL will be used.
       */
      ttl?: Milliseconds;
      /**
       * Force revalidation even if the item exists and hasn't expired. T
       * This means that the valueOrFn will be used to update the value and reset the TTL.
       */
      forceRevalidate?: boolean;
    }
  ): T {
    return typeof valueOrFn === 'function'
      ? (valueOrFn as () => T)()
      : valueOrFn;
  }

  peek(_key: TKey): undefined {
    return undefined;
  }

  delete(_key: TKey): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  *[Symbol.iterator](): IterableIterator<[TKey, TValue]> {}
}
