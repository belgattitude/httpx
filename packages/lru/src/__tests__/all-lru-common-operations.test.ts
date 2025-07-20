import { expectTypeOf } from 'vitest';

import { LruCache, type LruCacheParams } from '../lru-cache';
import { TimeLruCache } from '../time-lru-cache';

const falsyValues = [
  ['false', false],
  ['null', null],
  ['zero', 0],
  ['empty string', ''],
] as const;

const lruCaches = [
  ['LruCache', (params: LruCacheParams) => new LruCache(params)],
  [
    'TimeLruCache',
    (params: LruCacheParams) =>
      new TimeLruCache({ ...params, defaultTTL: 5000 }),
  ],
] as const;

describe.each(lruCaches)('Common operations', (cacheType, createCache) => {
  describe(`${cacheType}.set()`, () => {
    it('should set a value in the cache', () => {
      const lru = createCache({
        maxSize: 1,
      });
      const key =
        '{"limit":1000,"onlyData":false,"requestUrl":"http://localhost:3000/api/referential/product-v1?limit=1000"}';

      const newEntryWasCreated = lru.set(key, 'value');
      expect(newEntryWasCreated).toBe(true);
      expect(lru.get(key)).toBe('value');
      expect(lru.size).toBe(1);
    });
    it('should overwrite a value if exists and return false', () => {
      const lru = createCache({
        maxSize: 1,
      });
      lru.set('key', 'value');
      const newEntryWasCreated = lru.set('key', 'newValue');
      expect(newEntryWasCreated).toBe(false);
      expect(lru.get('key')).toBe('newValue');
      expect(lru.size).toBe(1);
    });
    it.each(falsyValues)(
      "should set a '%s' (falsy) value",
      (label, falsyValue) => {
        const lru = createCache({
          maxSize: 1,
        });
        lru.set(`key-${label}`, falsyValue);
        expect(lru.get(`key-${label}`)).toStrictEqual(falsyValue);
        expect(lru.size).toBe(1);
      }
    );
  });
  describe(`${cacheType}.delete()`, () => {
    it('should delete a value and update size', () => {
      const lru = createCache({
        maxSize: 3,
      });
      lru.set('key1', 'value1');
      lru.set('key2', 'value2');
      const wasRemoved = lru.delete('key1');
      expect(wasRemoved).toBe(true);
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
      expect(lru.size).toBe(1);
    });
    it.each(falsyValues)(
      "should delete a '%s' value and update size",
      (label, falsyValue) => {
        const lru = createCache({
          maxSize: 1,
        });
        const wasAdded = lru.set(`key-${label}`, falsyValue);
        expect(wasAdded).toBe(true);
        const wasRemoved = lru.delete(`key-${label}`);
        expect(wasRemoved).toBe(true);
        expect(lru.get(`key-${label}`)).toBeUndefined();
        expect(lru.size).toBe(0);
      }
    );
    it('should return false if value does not exists', () => {
      const lru = createCache({
        maxSize: 1,
      });
      const wasRemoved = lru.delete('key1');
      expect(wasRemoved).toBe(false);
      expect(lru.size).toBe(0);
    });
  });

  describe(`${cacheType}.has()`, () => {
    it('should return true if an entry exists', () => {
      const lru = createCache({
        maxSize: 2,
      });
      lru.set('key1', 'value1');
      expect(lru.has('key1')).toBe(true);
    });
    it('should return false if an entry does not exists', () => {
      const lru = createCache({
        maxSize: 1,
      });
      expect(lru.has('key')).toBe(false);
    });
  });

  describe(`${cacheType}.clear()`, () => {
    it('should properly clear all values and report size 0 and unset initial params', () => {
      const lru = createCache({
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

  describe(`${cacheType}.getOrSet()`, () => {
    it('should not overwrite existing entry if exist', () => {
      const lru = createCache({
        maxSize: 2,
      });
      lru.set('key', 'value');
      const value = lru.getOrSet('key', 'newValue');
      expect(value).toBe('value');
      expect(lru.size).toBe(1);
    });
    it(`should add new entry if it doesn't exist`, () => {
      const lru = createCache({
        maxSize: 3,
      });
      lru.set('key', 'value');
      const value2 = lru.getOrSet('key2', 'value2');
      const value3 = lru.getOrSet('key3', () => 'value3');
      expect(value2).toBe('value2');
      expect(value3).toBe('value3');
      expect(lru.size).toBe(3);
    });
    it('should automatically infer the type', () => {
      const lru = createCache({ maxSize: 1 });
      const str = 'string_not_inferred_as_const' as string;
      const fromValue = lru.getOrSet('key', str);
      expectTypeOf(fromValue).toEqualTypeOf<string>();
      const fromValueFn = lru.getOrSet('key', () => str);
      expectTypeOf(fromValueFn).toEqualTypeOf<string>();
    });
    it('should allow to type with a generic', () => {
      const lru = createCache({ maxSize: 1 });
      const withTypedString = lru.getOrSet<string>('test', 'string');
      expectTypeOf(withTypedString).toEqualTypeOf<string>();
      const withTypedFnString = lru.getOrSet<string>('test', () => 'string');
      expectTypeOf(withTypedFnString).toEqualTypeOf<string>();
    });
    // eslint-disable-next-line @vitest/expect-expect
    it('should not allow to type with a unsupported type', () => {
      const lru = createCache({ maxSize: 1 });
      // @ts-expect-error - Unsupported type
      lru.getOrSet('key', new Promise(() => {}));
    });
  });
  describe(`${cacheType}.[Symbol.iterator]`, () => {
    it('should be iterable with for const of and orders by least recently usage', () => {
      const lru = createCache({
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
  describe(`${cacheType} - Eviction`, () => {
    it('should evict items based on maxSize', () => {
      const lru = createCache({
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

      const lru = createCache({
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
