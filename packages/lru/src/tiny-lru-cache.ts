type SupportedKeys = string;

class Node<TValue, TKey extends SupportedKeys = string> {
  prev: Node<TValue, TKey> | null = null;
  next: Node<TValue, TKey> | null = null;
  constructor(public readonly key: TKey) {}
}

type DataType<TValue, TKey extends SupportedKeys = string> = {
  value: TValue;
  node: Node<TValue, TKey>;
};

type Params<TValue, TKey extends SupportedKeys = string> = {
  maxSize: number;
};

/**
 * Double linked list based lru cache that supports get in O(1)
 */
export class TinyLRUCache<
  TValue = unknown,
  TKey extends SupportedKeys = string,
> {
  #maxSize: number;

  #cache: Map<TKey, DataType<TValue, TKey>>;
  #head: Node<TValue, TKey> | null = null;
  #tail: Node<TValue, TKey> | null = null;

  /**
   * Create a new LRUCache instance
   *
   * @example
   * ```typescript
   * import { TinyLRUCache } from '@httpx/lru';
   *
   * const lru = new LRUCache({ maxSize: 1000 });
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
  constructor(params: Params<TValue, TKey>) {
    const { maxSize } = params;
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
  clear(): void {
    this.#cache.clear();
    this.#head = this.#tail = null;
  }

  /**
   * Check if an item exists.
   *
   * Does not touch the item, so it will not be moved to the head.
   */
  has(key: TKey): boolean {
    return this.#cache.has(key);
  }

  set(key: TKey, value: TValue): boolean {
    if (this.#cache.has(key)) {
      const data = this.#cache.get(key)!;
      data.value = value;
      this.#moveToHead(data.node);
      return false;
    }

    const newNode = new Node(key);
    const data: DataType<TValue, TKey> = { value, node: newNode };

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

  delete(key: TKey): boolean {
    const node = this.#cache.get(key)?.node;

    if (!node) {
      return false;
    }
    this.#removeNode(node);
    return this.#cache.delete(key);
  }

  #moveToHead(node: Node<TValue, TKey>): void {
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

  #removeNode(node: Node<TValue, TKey>): void {
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
    this.#cache.delete(tailKey);
  }
}
