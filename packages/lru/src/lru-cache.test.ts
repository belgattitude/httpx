import { LruCache } from './lru-cache';

describe('LruCache', () => {
  describe('get/set', () => {
    it('should set a value in the cache', () => {
      const lru = new LruCache({
        maxSize: 1,
      });
      lru.set('key', 'value');
      expect(lru.get('key')).toBe('value');
      expect(lru.size).toBe(1);
    });
  });
  describe('delete', () => {
    it('should properly delete a value and update size', () => {
      const lru = new LruCache({
        maxSize: 2,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      lru.delete('key1');
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
      expect(lru.size).toBe(1);
    });
  });

  describe('clear', () => {
    it('should properly clear all values and report size 0 and unset initial params', () => {
      const lru = new LruCache({
        maxSize: 2,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      expect(lru.size).toBe(2);
      const cleared = lru.clear();
      expect(cleared).toBe(2);
      expect(lru.size).toBe(0);
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBeUndefined();
      lru.set('key1', 'value1');
      expect(lru.get('key1')).toBe('value1');
    });
  });

  describe('getOrSet', () => {
    it('should not overwrite existing entry if exist', () => {
      const lru = new LruCache({
        maxSize: 2,
      });
      lru.set('key', 'value');
      const value = lru.getOrSet('key', 'newValue');
      expect(value).toBe('value');
      expect(lru.size).toBe(1);
    });
    it(`should add new entry if it doesn't exist`, () => {
      const lru = new LruCache({
        maxSize: 3,
      });
      lru.set('key', 'value');
      const value2 = lru.getOrSet('key2', 'value2');
      const value3 = lru.getOrSet('key3', () => 'value3');
      expect(value2).toBe('value2');
      expect(value3).toBe('value3');
      expect(lru.size).toBe(3);
    });
  });
  describe('iterable', () => {
    it('should be iterable with for const of and orders by least recently usage', () => {
      const lru = new LruCache({
        maxSize: 2,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      lru.set('key3', 'value3');
      lru.get('key2');
      const results = [];
      for (const [key, value] of lru) {
        results.push([key, value]);
      }
      expect(results).toStrictEqual([
        ['key3', 'value3'],
        ['key2', 'value2'],
      ]);
    });
  });
  describe('eviction', () => {
    it('should evict items based on maxSize', () => {
      const lru = new LruCache({
        maxSize: 2,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      lru.set('key3', 'value3');
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
      expect(lru.get('key3')).toBe('value3');
      expect(lru.size).toBe(2);
    });

    it('should call onEviction with correct key and value', () => {
      const fn = vi.fn();

      const lru = new LruCache({
        maxSize: 2,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      lru.set('key3', 'value3');
      expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
    });
  });
});
