import { DoublyLinkedListNode } from './base';
import type {
  BaseCache,
  BaseCacheKeyTypes,
  SupportedCacheValues,
} from './types';

type LruCacheEntry<TValue, TKey extends BaseCacheKeyTypes = string> = {
  value: TValue;
  node: DoublyLinkedListNode<TValue, TKey>;
};

export type LruCacheParams<TValue, TKey extends BaseCacheKeyTypes = string> = {
  /**
   * The maximum number of items that the cache can hold.
   */
  maxSize: number;
  /**
   * If true, the item will be marked as recently used when calling has.
   * @default false
   */
  touchOnHas?: boolean;
  /**
   * Callback that will be called before an item is evicted from the cache.
   * Useful for side effects or for items like object URLs that need explicit cleanup (revokeObjectURL).
   */
  onEviction?: (key: TKey, value: TValue) => void;
};

/**
 * Double linked list based lru cache that supports get in O(1)
 */
export class LruCache<
  TValue extends SupportedCacheValues = SupportedCacheValues,
  TKey extends BaseCacheKeyTypes = string,
> implements BaseCache<TValue, TKey>
{
  #maxSize: number;
  #touchOnHas: boolean;
  #onEviction?: ((key: TKey, value: TValue) => void) | undefined;

  #cache: Map<TKey, LruCacheEntry<TValue, TKey>>;
  #head: DoublyLinkedListNode<TValue, TKey> | null = null;
  #tail: DoublyLinkedListNode<TValue, TKey> | null = null;

  /**
   * Create a new LruCache instance
   *
   * @example
   * ```typescript
   * import { LruCache } from '@httpx/lru';
   *
   * const lru = new LruCache({ maxSize: 1000 });
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
  constructor(params: LruCacheParams<TValue, TKey>) {
    const { maxSize, touchOnHas = false, onEviction } = params;
    if (!Number.isSafeInteger(maxSize) || maxSize < 1) {
      throw new TypeError('Invalid maxSize');
    }
    this.#touchOnHas = touchOnHas;
    this.#onEviction = onEviction;
    this.#maxSize = maxSize;
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
   * Check if an item exists.
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
    const hasEntry = this.#cache.has(key);
    if (hasEntry && (options?.touch ?? this.#touchOnHas)) {
      this.#moveToHead(this.#cache.get(key)!.node);
    }
    return hasEntry;
  }

  set(key: TKey, value: TValue): boolean {
    if (this.#cache.has(key)) {
      const data = this.#cache.get(key)!;
      data.value = value;
      this.#moveToHead(data.node);
      return false;
    }

    const newNode = new DoublyLinkedListNode(key);
    const data: LruCacheEntry<TValue, TKey> = { value, node: newNode };

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
    this.#moveToHead(data.node);

    return data.value;
  }

  /**
   * Get an item from the cache without overwriting it if it already exists.
   * @see upcoming proposal https://github.com/tc39/proposal-upsert
   *
   * @example
   * ```typescript
   * const lru = new LruCache({ maxSize: 2 });
   * lru.set('key1', 'value1');
   * lru.getOrSet('key1', 'value2');    // 👈 will not overwrite the value
   * lru.getOrSet('key2', () => true)); // 👈 with callback
   * console.log(lru.get('key1')); // value1
   * ```
   */
  getOrSet(key: TKey, valueOrFn: TValue | (() => TValue)): TValue {
    if (this.#cache.has(key)) {
      return this.get(key)!;
    }
    const value = typeof valueOrFn === 'function' ? valueOrFn() : valueOrFn;
    this.set(key, value);
    return value;
  }

  /**
   * Get an item without marking it as recently used.
   */
  peek(key: TKey): TValue | undefined {
    return this.#cache.get(key)?.value;
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
