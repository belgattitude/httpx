import type { LruCacheParams } from './lru-cache';
import type { ILruCache } from './lru-cache.interface';
import type {
  BaseCacheKeyTypes,
  LruCacheHasOptions,
  SupportedCacheValues,
} from './types';

export class NullLruCache<
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
> implements ILruCache<TValue, TKey> {
  /**
   * Create a new NullLruCache (does cache nothing)
   *
   * @example
   * ```typescript
   * import { NullLruCache } from '@httpx/lru';
   *
   * const lru = new NullLruCache({ maxSize: 1000 });
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_params: LruCacheParams<TValue, TKey>) {}

  readonly size = 0;
  readonly params = {
    maxSize: 0,
  };

  clear(): number {
    return 0;
  }

  has(_key: TKey, _options?: LruCacheHasOptions): boolean {
    return false;
  }

  set(_key: TKey, _value: TValue): boolean {
    return false;
  }

  get(_key: TKey): undefined {
    return undefined;
  }

  getOrSet<T extends TValue>(_key: TKey, valueOrFn: T | (() => T)): T {
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
