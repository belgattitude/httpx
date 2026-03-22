import type {
  BaseCacheKeyTypes,
  LruCacheHasOptions,
  SupportedCacheValues,
} from './types';

export interface ILruCache<
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
> {
  /**
   * Return the params
   */
  readonly params: {
    maxSize: number;
  };

  /**
   * Return the current number of items in the cache
   */
  readonly size: number;

  /**
   * Clear all entries from the cache and return the number of deleted items
   */
  clear: () => number;

  /**
   * Checks whether an entry exist.
   *
   * The item will be marked as recently used only if either
   *
   *  - the global cache `touchOnHas` option is true (default: false)
   *  - or the `touch` option is true (default false)
   *
   * @example
   * ```typescript
   * import { LruCache } from '@httpx/lru';
   *
   * const lru = new LruCache({
   *   maxSize: 1,
   *   // 👇 Optional, default to false
   *   touchOnHas: false,
   * });
   *
   * lru.set('key0', 'value0');
   * // 👇 Will evict key0 as maxSize is 1
   * lru.set('key1', 'value1');
   *
   * lru.has('key0'); // 👈 false
   * lru.has('key1'); // 👈 true  (item is present)
   * lru.has('key1', {
   *   // 👇 Optional, default to global touchOnHas
   *   touch: false
   * }); // 👈 true  (item is present)
   * ```
   */
  has: (key: TKey, options?: LruCacheHasOptions) => boolean;

  /**
   * Get an item from the cache or return undefined if it doesn't exist.
   * Item will be marked as most recently used.
   *
   * ```typescript
   * import { LruCache } from '@httpx/lru';
   *
   * const lru = new LruCache({ maxSize: 1 });
   *
   * lru.set('key0', 'value0');
   * lru.get('key0');   // 👈 'value0'
   * lru.get('key1');   // 👈 undefined
   * ```
   */
  get: (key: TKey) => TValue | undefined;

  /**
   * Add a new entry to the cache and overwrite value if the key was already
   * present.It will move the item as the most recently used.
   *
   * Note that eviction will happen if maximum capacity is reached..
   *
   * ```typescript
   * import { LruCache } from '@httpx/lru';
   *
   * const lru = new LruCache({
   *   maxSize: 1,
   *   onEviction: () => { console.log('evicted') }
   * });
   *
   * lru.set('key0', 'value0'); // 👈 true (new key, size increase)
   * lru.set('key0', 'valuex'); // 👈 false (existing key, no size increase)
   *
   *  // 👇 Will evict key0 as maxSize is 1 and trigger onEviction
   * lru.set('key2', 'value2'); // 👈 true (existing key, no size increase)
   * ```
   */
  set: (key: TKey, value: TValue) => boolean;

  /**
   * Get an item from the cache, if the item doesn't exist or has expired
   * it will create a new entry with the provided value or function and returns it.
   *
   * In case of a new entry (key either doesn't exist or has expired):
   *  - the provided value or the result of the function will be used as value.
   *  - it will be marked as most recently used.
   *  - an eviction will be triggered if the maximum capacity is reached
   *
   * In case the item exists and hasn't expired:
   *  - the existing value will be returned.
   *  - it will be marked as most recently used.
   *
   * @example
   * ```typescript
   * const lru = new LruCache({ maxSize: 2 });
   *
   * // The key exists
   * lru.set('key1', 'value1');
   * lru.getOrSet('key1', () => 'value2');         // 👈 returns 'value1' (entry exists)
   *
   * // The key doesn't exist, a new entry will be created from the function return value
   * lru.getOrSet('key2', () => 'value2');  // 👈 returns 'value2'
   * lru.has('key2');                              // 👈 true (it was added)
   * lru.get('key1');                              // 👈 'value1'
   *
   * // Will trigger an eviction as maxSize capacity (2) is reached.
   * lru.getOrSet('key3', () => 'value3');        // 👈 returns 'value3'
   *
   * lru.get('key1'); // 👈 undefined (first entry was evicted)
   * ```
   */
  getOrSet: <T extends TValue>(key: TKey, valueOrFn: T | (() => T)) => T;

  /**
   * Get an item without marking it as recently used or undefined if item doesn't exist.
   */
  peek: (key: TKey) => TValue | undefined;

  /**
   * Delete an item from the cache and return a boolean indicating
   * if the item was actually deleted in case it exist.
   */
  delete: (key: TKey) => boolean;

  /**
   * Iterate over the cache from the least recently used to the most recently used.
   *
   * Iterating over results does not mark the items as recently.
   *
   * @example
   * ```typescript
   * import { LruCache } from '@httpx/lru';
   *
   * const lru = new LruCache({ maxSize: 2 });
   *
   * // 👇 Fill the cache with 3 entries
   * lru.set('key1', 'value1');
   * lru.set('key2', 'value2');
   * lru.set('key3', 'value3'); // 👈 Will evict key1 as maxSize is 2
   *
   * lru.get('key2'); // 👈 Trigger a get to move key2 to the head
   *
   * const results = [];
   *
   * // 🖖 Iterate over the cache entries
   * for (const [key, value] of lru) {
   *   results.push([key, value]);
   * }
   *
   * expect(results).toStrictEqual([
   *    ['key3', 'value3'], // 👈  Least recently used first
   *    ['key2', 'value2'], // 👈  Most recently used last
   * ]);
   * ```
   */
  [Symbol.iterator]: () => IterableIterator<[TKey, TValue]>;
}
