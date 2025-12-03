import { DoublyLinkedNode } from './doubly-linked-node';
import type { ILruCache } from './lru-cache.interface';
import type {
  BaseCacheKeyTypes,
  LruCacheHasOptions,
  SupportedCacheValues,
} from './types';

type LruCacheEntry<TValue, TKey extends BaseCacheKeyTypes = string> = {
  value: TValue;
  node: DoublyLinkedNode<TValue, TKey>;
};

export type LruCacheParams<
  TValue = unknown,
  TKey extends BaseCacheKeyTypes = string,
> = {
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
> implements ILruCache<TValue, TKey> {
  #maxSize: number;
  #touchOnHas: boolean;
  #onEviction?: ((key: TKey, value: TValue) => void) | undefined;

  #cache: Map<TKey, LruCacheEntry<TValue, TKey>>;
  #head: DoublyLinkedNode<TValue, TKey> | null = null;
  #tail: DoublyLinkedNode<TValue, TKey> | null = null;

  /**
   * Create a new LruCache instance.
   *
   * 👉 As an alternative to constructor, consider using the helper
   * `getOrCreateLruCache` to ensure only one instance is created.
   *
   * @example
   * ```typescript
   * import { LruCache } from '@httpx/lru';
   *
   * const lru = new LruCache({ maxSize: 1000 });
   *
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

  get params(): ILruCache['params'] {
    return {
      maxSize: this.#maxSize,
    };
  }

  /**
   * Return the current number of items in the cache
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

    const newNode = new DoublyLinkedNode(key);
    const data: LruCacheEntry<TValue, TKey> = { value, node: newNode };

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
    this.#moveToHead(data.node);
    return data.value;
  }

  getOrSet<T extends TValue>(key: TKey, valueOrFn: T | (() => T)): T {
    const val = this.get(key);
    if (val === undefined) {
      const value =
        typeof valueOrFn === 'function' ? (valueOrFn as () => T)() : valueOrFn;
      this.set(key, value as unknown as TValue);
      return value;
    }
    return val as unknown as T;
  }

  peek(key: TKey): TValue | undefined {
    return this.#cache.get(key)?.value;
  }

  delete(key: TKey): boolean {
    const node = this.#cache.get(key)?.node;
    if (node === undefined) {
      return false;
    }
    this.#removeNode(node);
    return this.#cache.delete(key);
  }

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
