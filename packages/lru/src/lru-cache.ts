class Node<T> {
  prev: Node<T> | null = null;
  next: Node<T> | null = null;
  constructor(public readonly key: T) {}
}

type DataType<T> = {
  value: T;
  node: Node<T>;
};

/**
 * Double linked list based lru cache that supports get in O(1)
 */
export class LRUCache<TValue = unknown> {
  private maxSize: number;

  private cache: Map<TValue, DataType<TValue>>;
  private head: Node<TValue> | null = null;
  private tail: Node<TValue> | null = null;

  constructor(params: { maxSize: number }) {
    const { maxSize } = params;
    if (!Number.isSafeInteger(maxSize) && maxSize < 1) {
      throw new TypeError(
        'Invalid maxSize param. Must be an integer greater than zero'
      );
    }
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  private moveToHead(node: Node<TValue>): void {
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

  has(key: TValue): boolean {
    return this.cache.has(key);
  }

  set(key: TValue, value: TValue): boolean {
    if (this.cache.has(key)) {
      const data = this.cache.get(key)!;
      data.value = value;
      this.moveToHead(data.node);
    } else {
      const newNode = new Node(key);
      const data: DataType<TValue> = { value, node: newNode };

      this.cache.set(key, data);
      this.moveToHead(newNode);

      if (this.cache.size > this.maxSize) {
        this.removeTail();
      }
    }
    return this.cache.has(key);
  }

  get(key: TValue): TValue | undefined {
    if (!this.cache.has(key)) {
      return;
    }

    const data = this.cache.get(key)!;
    this.moveToHead(data.node);

    return data.value;
  }

  delete(key: TValue): boolean {
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

  toArray(): TValue[][] {
    const result: TValue[][] = [];
    let current = this.tail;

    while (current) {
      const data = this.cache.get(current.key)!;
      result.push([current.key, data.value]);
      current = current.prev;
    }

    return result;
  }
}
