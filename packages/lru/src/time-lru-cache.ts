import { DoublyLinkedNode } from './doubly-linked-node';
import type { LruCacheParams } from './lru-cache';
import type { ITimeLruCache } from './time-lru-cache.interface';
import type {
  BaseCacheKeyTypes,
  EpochTimeInMilliseconds,
  LruCacheHasOptions,
  Milliseconds,
  SupportedCacheValues,
} from './types';

type TimeLruCacheEntry<TValue, TKey extends BaseCacheKeyTypes = string> = {
  value: TValue;
  expiry: EpochTimeInMilliseconds;
  node: DoublyLinkedNode<TValue, TKey>;
};

export type TimeLruCacheParams<
  TValue = unknown,
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
> implements ITimeLruCache<TValue, TKey>
{
  #maxSize: number;
  #touchOnHas: boolean;

  #ttl: Milliseconds;

  #onEviction?: ((key: TKey, value: TValue) => void) | undefined;

  #cache: Map<TKey, TimeLruCacheEntry<TValue, TKey>>;
  #head: DoublyLinkedNode<TValue, TKey> | null = null;
  #tail: DoublyLinkedNode<TValue, TKey> | null = null;

  /**
   * Create a new LruCache instance
   *
   * 👉 As an alternative to constructor, consider using the helper
   * `getOrCreateTimeLruCache` to ensure only one instance is created.
   *
   * @example
   * ```typescript
   * import { TimeLruCache } from '@httpx/lru';
   *
   * const THIRTY_SECONDS_IN_MILLIS = 30_000
   *
   * const lru = new TimeLruCache({ maxSize: 1000, defaultTTL: THIRTY_SECONDS_IN_MILLIS});
   * lru.set('🦄', ['cool', 'stuff'], THIRTY_SECONDS_IN_MILLIS);
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
  get params(): ITimeLruCache['params'] {
    return {
      maxSize: this.#maxSize,
      defaultTTL: this.#ttl,
    };
  }

  /**
   * Return the current number of entries in the cache
   */
  get size(): number {
    return this.#cache.size;
  }

  clear(): number {
    const size = this.#cache.size;
    this.#cache.clear();
    this.#head = this.#tail = null;
    return size;
  }

  has(key: TKey, options?: LruCacheHasOptions): boolean {
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

    const newNode = new DoublyLinkedNode(key);
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
    const data = this.#cache.get(key);
    if (data === undefined) {
      return;
    }
    if (data.expiry < Date.now()) {
      if (this.#onEviction) {
        this.#onEviction(key, data.value);
      }
      this.#removeNode(data.node);
      return;
    }

    this.#moveToHead(data.node);

    return data.value;
  }

  getOrSet<T extends TValue>(
    key: TKey,
    valueOrFn: T | (() => T),
    ttl?: Milliseconds
  ): T {
    const val = this.get(key);
    if (val === undefined) {
      const value =
        typeof valueOrFn === 'function' ? (valueOrFn as () => T)() : valueOrFn;
      this.set(key, value as unknown as TValue, ttl);
      return value;
    }
    return val as unknown as T;
  }

  peek(key: TKey): TValue | undefined {
    const val = this.#cache.get(key);
    if (val === undefined) {
      return;
    }
    return val.expiry < Date.now() ? undefined : val.value;
  }

  delete(key: TKey): boolean {
    const node = this.#cache.get(key)?.node;
    if (node === undefined) {
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

  #moveToHead(node: DoublyLinkedNode<TValue, TKey>): void {
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
    this.#tail ??= node;
  }

  #removeNode(node: DoublyLinkedNode<TValue, TKey>): void {
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
    if (this.#tail === null) {
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
