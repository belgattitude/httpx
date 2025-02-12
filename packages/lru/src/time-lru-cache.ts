import { DoublyLinkedListNode } from './base';
import type { LruCacheParams } from './lru-cache';
import type {
  BaseCache,
  BaseCacheKeyTypes,
  EpochTimeInMilliseconds,
  Milliseconds,
  SupportedCacheValues,
} from './types';

type TimeLruCacheEntry<TValue, TKey extends BaseCacheKeyTypes = string> = {
  value: TValue;
  expiry: EpochTimeInMilliseconds;
  node: DoublyLinkedListNode<TValue, TKey>;
};

type TimeLruCacheParams<
  TValue,
  TKey extends BaseCacheKeyTypes = string,
> = LruCacheParams<TValue, TKey> & {
  /**
   * Default time to live for each entry in milliseconds
   */
  defaultTTL: Milliseconds;
};

/**
 * Double linked list based lru cache that supports get in O(1) and time to live for each entry
 */
export class TimeLruCache<
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
> implements BaseCache<TValue, TKey>
{
  #maxSize: number;
  #touchOnHas: boolean;

  #ttl: Milliseconds;

  #onEviction?: ((key: TKey, value: TValue) => void) | undefined;

  #cache: Map<TKey, TimeLruCacheEntry<TValue, TKey>>;
  #head: DoublyLinkedListNode<TValue, TKey> | null = null;
  #tail: DoublyLinkedListNode<TValue, TKey> | null = null;

  /**
   * Create a new LruCache instance
   *
   * @example
   * ```typescript
   * import { TimeLruCache } from '@httpx/lru';
   *
   * const THIRTY_SECONDS_IN_MILLIS = 30_000
   *
   * const lru = new TimeLruCache({ maxSize: 1000, defaultTTL: THIRTY_SECONDS_IN_MILLIS});
   * lru.set('🦄', ['cool', 'stuff']);
   * if (lru.has('🦄')) {;
   *  console.log(lru.get('🦄'));
   *  // ['cool', 'stuff']
   * }
   * console.log(lru.size); // 1
   * lru.delete('🦄');
   * console.log(lru.size); // 0
   * lru.clear();
   * ```
   */
  constructor(params: TimeLruCacheParams<TValue, TKey>) {
    const { maxSize, touchOnHas = false, onEviction, defaultTTL } = params;
    if (!Number.isSafeInteger(maxSize) || maxSize < 1) {
      throw new TypeError('Invalid maxSize');
    }
    if (!Number.isSafeInteger(defaultTTL) || defaultTTL < 1) {
      throw new TypeError('Invalid ttl');
    }

    this.#touchOnHas = touchOnHas;
    this.#onEviction = onEviction;
    this.#maxSize = maxSize;
    this.#ttl = defaultTTL;
    this.#cache = new Map();
  }

  /**
   * Return the current size of the cache
   */
  get size(): number {
    return this.#cache.size;
  }

  /**
   * Clear all entries from the cache
   */
  clear(): number {
    const size = this.#cache.size;
    this.#cache.clear();
    this.#head = this.#tail = null;
    return size;
  }

  /**
   * Checks whether an entry exist and hasn't expired. If the entry exists but has expired, it will be removed
   * automatically and trigger the `onEviction` callback if present.
   *
   * ```typescript
   * import { TimeLruCache } from '@httpx/lru';
   *
   * const oneSecondInMillis = 1000;
   *
   * const lru = new TimeLruCache({
   *   maxSize: 1,
   *   defaultTTL: oneSecondInMillis,
   *   onEviction: () => { console.log('evicted') }
   * });
   *
   * lru.set('key0', 'value0', 2 * oneSecondInMillis);
   *
   * // 👇 Will evict key0 as maxSize is 1
   * lru.set('key1', 'value1', 2 * oneSecondInMillis);
   *
   * lru.has('key0'); // 👈 false (item does not exists)
   * lru.has('key1'); // 👈 true  (item is present and is not expired)
   *
   * const value = lru.get('key1'); // 👈 'value1' (item is present and is not expired)
   *
   * // 🕛 wait 3 seconds, time for the item to expire
   *
   * lru.has('key1'); // 👈 false (item is present but expired - 👋 onEviction will be called)
   * ```
   *
   */
  has(
    key: TKey,
    options?: {
      /**
       * If true, the item will be marked as recently used.
       * @default option touchOnHas in the constructor
       */
      touch?: boolean;
    }
  ): boolean {
    const value = this.#cache.get(key);
    const hasEntry = value !== undefined;
    const hasExpired = hasEntry && value.expiry < Date.now();

    if (hasExpired) {
      if (this.#onEviction) {
        this.#onEviction(key, this.#cache.get(key)!.value);
      }
      this.#removeNode(value.node);
      return false;
    }

    if (hasEntry && (options?.touch ?? this.#touchOnHas)) {
      this.#moveToHead(this.#cache.get(key)!.node);
    }
    return hasEntry;
  }

  set(key: TKey, value: TValue, ttl?: Milliseconds): boolean {
    if (this.#cache.has(key)) {
      const data = this.#cache.get(key)!;
      data.value = value;
      data.expiry = Date.now() + (ttl ?? this.#ttl);
      this.#moveToHead(data.node);
      return false;
    }

    const newNode = new DoublyLinkedListNode(key);
    const data: TimeLruCacheEntry<TValue, TKey> = {
      value,
      expiry: Date.now() + (ttl ?? this.#ttl),
      node: newNode,
    };

    this.#cache.set(key, data);
    this.#moveToHead(newNode);

    if (this.#cache.size > this.#maxSize) {
      this.#removeTail();
    }
    return true;
  }

  get(key: TKey): TValue | undefined {
    if (!this.#cache.has(key)) {
      return;
    }

    const data = this.#cache.get(key)!;
    if (data.expiry < Date.now()) {
      if (this.#onEviction) {
        this.#onEviction(key, this.#cache.get(key)!.value);
      }
      this.#removeNode(data.node);
      return;
    }

    this.#moveToHead(data.node);

    return data.value;
  }

  /**
   * Get an item from the cache without overwriting it if it already exists.
   * @see upcoming proposal https://github.com/tc39/proposal-upsert
   *
   * @example
   * ```typescript
   * const lru = new TimeLruCache({ maxSize: 2 });
   * lru.set('key1', 'value1');
   * lru.getOrSet('key1', 'value2'); // 👈 will not overwrite the value
   * lru.getOrSet('key2', () => true)); // 👈 with callback
   * console.log(lru.get('key1')); // value1
   * ```
   */
  getOrSet(
    key: TKey,
    valueOrFn: TValue | (() => TValue),
    ttl?: Milliseconds
  ): TValue {
    const val = this.get(key);
    if (val === undefined) {
      const value = typeof valueOrFn === 'function' ? valueOrFn() : valueOrFn;
      this.set(key, value, ttl);
      return value;
    }
    return val;
  }

  /**
   * Get an item without marking it as recently used.
   */
  peek(key: TKey): TValue | undefined {
    const val = this.#cache.get(key);
    if (val === undefined) {
      return;
    }
    return val.expiry < Date.now() ? undefined : val.value;
  }

  /**
   * Delete an item from the cache and return a boolean indicating
   * if the item was actually deleted in case it exist.
   */
  delete(key: TKey): boolean {
    const node = this.#cache.get(key)?.node;

    if (!node) {
      return false;
    }
    this.#removeNode(node);
    return this.#cache.delete(key);
  }

  /**
   * Iterate over the cache from the least recently used to the most recently used.
   *
   * ```typescript
   * const lru = new LruCache({ maxSize: 2 });
   * lru.set('key1', 'value1');
   * lru.set('key2', 'value2');
   * lru.set('key3', 'value3');
   * // trigger a get to move key2 to the head
   * lru.get('key2');
   * const results = [];
   * // iterate over the cache entries
   * for (const [key, value] of lru) {
   *   results.push([key, value]);
   * }
   * expect(results).toStrictEqual([
   *    ['key3', 'value3'], // Least recently used
   *    ['key2', 'value2'], // Most recently used
   * ]);
   * ```
   */
  *[Symbol.iterator](): IterableIterator<[TKey, TValue]> {
    let current = this.#tail;

    while (current) {
      const data = this.#cache.get(current.key)!;
      yield [current.key, data.value];
      current = current.prev;
    }
  }

  #moveToHead(node: DoublyLinkedListNode<TValue, TKey>): void {
    if (node === this.#head) {
      return;
    }
    this.#removeNode(node);
    node.next = this.#head;
    node.prev = null;
    if (this.#head) {
      this.#head.prev = node;
    }
    this.#head = node;
    if (!this.#tail) {
      this.#tail = node;
    }
  }

  #removeNode(node: DoublyLinkedListNode<TValue, TKey>): void {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    if (node === this.#head) {
      this.#head = node.next;
    }
    if (node === this.#tail) {
      this.#tail = node.prev;
    }
  }

  #removeTail(): void {
    if (!this.#tail) {
      return;
    }
    const tailKey = this.#tail.key;
    this.#removeNode(this.#tail);
    if (this.#onEviction) {
      this.#onEviction(tailKey, this.#cache.get(tailKey)!.value);
    }
    this.#cache.delete(tailKey);
  }
}
