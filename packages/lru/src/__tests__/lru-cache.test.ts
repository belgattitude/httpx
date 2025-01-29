import { BaseLru } from '../base-lru';

describe('BaseLru', () => {
  describe('Base.get/set', () => {
    it('should set a value in the cache', () => {
      const lru = new BaseLru({
        maxSize: 1,
      });
      lru.set('key', 'value');
      expect(lru.get('key')).toBe('value');
    });
  });
  describe('Eviction', () => {
    it('should evict items based on maxSize', () => {
      const lru = new BaseLru({
        maxSize: 2,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      lru.set('key3', 'value3');
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
      expect(lru.get('key3')).toBe('value3');
      expect(lru.size()).toBe(2);
    });
  });
});
