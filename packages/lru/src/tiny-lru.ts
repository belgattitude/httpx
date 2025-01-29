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
  onEviction?: (key: TKey, value: TValue) => void;
};

/**
 * Double linked list based lru cache that supports get in O(1)
 */
export class TinyLRU<TValue = unknown, TKey extends SupportedKeys = string> {
  private maxSize: number;

  private cache: Map<TKey, DataType<TValue, TKey>>;
  private head: Node<TValue, TKey> | null = null;
  private tail: Node<TValue, TKey> | null = null;

  /**
   * Create a new TinyLRU instance
   *
   * @example
   * ```typescript
   * import { TinyLRU } from '@httpx/lru';
   *
   * const lru = new TinyLRU({ maxSize: 1000 });
   * lru.set('🦄', ['cool', 'stuff']);
   * if (lru.has('🦄')) {;
   *  console.log(lru.get('🦄'));
   *  // ['cool', 'stuff']
   * }
   * lru.delete('🦄');
   * lru.clear();
   * ```
   */
  constructor(params: Params<TValue, TKey>) {
    const { maxSize } = params;
    if (!Number.isSafeInteger(maxSize) && maxSize < 1) {
      throw new TypeError(
        'Invalid maxSize param. Must be an integer greater than zero'
      );
    }
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  private moveToHead(node: Node<TValue, TKey>): void {
    if (node === this.head) {
      return;
    }
    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }

    if (node === this.tail) {
      this.tail = node.prev;
    }

    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private removeTail() {
    if (!this.tail) {
      return;
    }

    this.cache.delete(this.tail.key);

    if (this.tail.prev) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      this.head = this.tail = null;
    }
  }

  size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: TKey): boolean {
    return this.cache.has(key);
  }

  set(key: TKey, value: TValue): boolean {
    if (this.cache.has(key)) {
      const data = this.cache.get(key)!;
      data.value = value;
      this.moveToHead(data.node);
    } else {
      const newNode = new Node(key);
      const data: DataType<TValue, TKey> = { value, node: newNode };

      this.cache.set(key, data);
      this.moveToHead(newNode);

      if (this.cache.size > this.maxSize) {
        this.removeTail();
      }
    }
    return this.cache.has(key);
  }

  get(key: TKey): TValue | undefined {
    if (!this.cache.has(key)) {
      return;
    }

    const data = this.cache.get(key)!;
    this.moveToHead(data.node);

    return data.value;
  }

  delete(key: TKey): boolean {
    const node = this.cache.get(key)?.node;

    if (!node) {
      return false;
    }

    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }

    if (node === this.head) {
      this.head = node.next;
    }

    if (node === this.tail) {
      this.tail = node.prev;
    }

    return this.cache.delete(key);
  }

  toArray(): [key: TKey, value: TValue][] {
    const result: [key: TKey, value: TValue][] = [];
    let current = this.tail;

    while (current) {
      const data = this.cache.get(current.key)!;
      result.push([current.key, data.value]);
      current = current.prev;
    }
    return result;
  }
}
