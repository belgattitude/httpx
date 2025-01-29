import { TinyLRU } from '../tiny-lru';

describe('TinyLRU', () => {
  describe('get/set', () => {
    it('should set a value in the cache', () => {
      const lru = new TinyLRU({
        maxSize: 1,
      });
      lru.set('key', 'value');
      expect(lru.get('key')).toBe('value');
      expect(lru.size).toBe(1);
    });
  });
  describe('delete', () => {
    it('should properly delete a value and update size', () => {
      const lru = new TinyLRU({
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
    it('should properly clear all values and report size 0', () => {
      const lru = new TinyLRU({
        maxSize: 2,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      lru.clear();
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBeUndefined();
      expect(lru.size).toBe(0);
    });
  });

  describe('getOrInsert', () => {
    it('should not overwrite existing entry if exist', () => {
      const lru = new TinyLRU({
        maxSize: 2,
      });
      lru.set('key', 'value');
      const value = lru.getOrInsert('key', 'newValue');
      expect(value).toBe('value');
      expect(lru.size).toBe(1);
    });
    it(`should add new entry if it doesn't exist`, () => {
      const lru = new TinyLRU({
        maxSize: 2,
      });
      lru.set('key', 'value');
      const value = lru.getOrInsert('key2', 'value2');
      expect(value).toBe('value2');
      expect(lru.size).toBe(2);
    });
  });
  describe('iterable', () => {
    it('should be iterable with for const of and orders by least recently usage', () => {
      const lru = new TinyLRU({
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
      const lru = new TinyLRU({
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

      const lru = new TinyLRU({
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
