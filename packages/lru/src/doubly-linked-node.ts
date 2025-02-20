import type { BaseCacheKeyTypes } from './types';

export class DoublyLinkedNode<TValue, TKey extends BaseCacheKeyTypes = string> {
  readonly key: TKey;
  prev: DoublyLinkedNode<TValue, TKey> | null = null;
  next: DoublyLinkedNode<TValue, TKey> | null = null;
  constructor(key: TKey) {
    this.key = key;
  }
}
