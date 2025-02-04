export type BaseCacheKeyTypes = string | number;
export type Milliseconds = number;
type PositiveNumberGreaterThanZero = number;
export type EpochTimeInMilliseconds = PositiveNumberGreaterThanZero;

export interface BaseCacheHasOptions {
  /**
   * If true, the item will be marked as recently used.
   * @default option touchOnHas in the constructor
   */
  touch?: boolean;
}

export interface BaseCache<
  TValue = unknown,
  TKey extends BaseCacheKeyTypes = string,
> {
  /**
   * Return the current size of the cache
   */
  size: number;

  /**
   * Clear all entries from the cache and return the number of deleted items
   */
  clear: () => void;

  /**
   * Check if an item exists.
   */
  has: (key: TKey, options?: BaseCacheHasOptions) => boolean;

  /**
   * Get an item from the cache or return undefined if it doesn't exist
   */
  get: (key: TKey) => TValue | undefined;

  /**
   * Get an item from the cache without overwriting it if it already exists.
   * @see upcoming proposal https://github.com/tc39/proposal-upsert
   *
   * @example
   * ```typescript
   * const lru = new LRUCache({ maxSize: 2 });
   * lru.set('key1', 'value1');
   * lru.getOrSet('key1', 'value2'); // 👈 will not overwrite the value
   * console.log(lru.get('key1')); // value1
   * ```
   */
  getOrSet: (key: TKey, value: TValue) => TValue;

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
   */
  [Symbol.iterator]: () => IterableIterator<[TKey, TValue]>;
}
