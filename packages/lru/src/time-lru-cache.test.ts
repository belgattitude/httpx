import { TimeLRUCache } from './time-lru-cache';

const HUNDRED_MILLIS = 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('TimeLRUCache', () => {
  describe('get/set', () => {
    it('should set a value in the cache', async () => {
      const lru = new TimeLRUCache({
        maxSize: 1,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      expect(lru.get('key1')).toBe('value1');
      expect(lru.size).toBe(1);
    });
  });
  describe('delete', () => {
    it('should properly delete a value and update size', () => {
      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      lru.set('key2', 'value2', HUNDRED_MILLIS);
      lru.delete('key1');
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
      expect(lru.size).toBe(1);
    });
  });

  describe('clear', () => {
    it('should properly clear all values and report size 0 and unset initial params', () => {
      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
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
      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key', 'value');
      const value = lru.getOrSet('key', 'newValue', HUNDRED_MILLIS);
      expect(value).toBe('value');
      expect(lru.size).toBe(1);
    });
    it(`should add new entry if it doesn't exist`, () => {
      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key', 'value');
      const value = lru.getOrSet('key2', 'value2');
      expect(value).toBe('value2');
      expect(lru.size).toBe(2);
    });
  });
  describe('iterable', () => {
    it('should be iterable with for const of and orders by least recently usage', () => {
      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
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
      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      lru.set('key3', 'value3');
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
      expect(lru.get('key3')).toBe('value3');
      expect(lru.size).toBe(2);
    });

    it('should evict items based on ttl', async () => {
      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      lru.set('key2', 'value2', HUNDRED_MILLIS * 4);
      expect(lru.get('key1')).toBe('value1');
      expect(lru.get('key2')).toBe('value2');
      await wait(HUNDRED_MILLIS);
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
    });

    it('should call onEviction when capacity reached', async () => {
      const fn = vi.fn();

      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      lru.set('key2', 'value2', HUNDRED_MILLIS);
      lru.set('key3', 'value3', HUNDRED_MILLIS);
      expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
    });

    it('should call onEviction when trying to get an expired item', async () => {
      const fn = vi.fn();

      const lru = new TimeLRUCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      lru.set('key2', 'value2', HUNDRED_MILLIS * 4);
      await wait(HUNDRED_MILLIS);
      lru.get('key1');
      lru.get('key2');
      expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
    });
  });
});
