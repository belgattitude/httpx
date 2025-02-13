import type { BaseCacheKeyTypes } from './types';

export class DoublyLinkedListNode<
  TValue,
  TKey extends BaseCacheKeyTypes = string,
> {
  readonly key: TKey;
  prev: DoublyLinkedListNode<TValue, TKey> | null = null;
  next: DoublyLinkedListNode<TValue, TKey> | null = null;
  constructor(key: TKey) {
    this.key = key;
  }
}
