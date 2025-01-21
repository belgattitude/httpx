import { createLRU } from '../lru-cache';

describe('lru cache', () => {
  it('should return cached value', () => {
    const lruCache = createLRU({
      maxLruSize: 10,
      onEviction: () => {},
    });
    lruCache.put('key1', 'value1');
    expect(lruCache.('key1'))
  });
});
