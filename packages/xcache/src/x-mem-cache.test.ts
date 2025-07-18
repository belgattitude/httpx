import { TimeLruCache } from '@httpx/lru';
import { expectTypeOf } from 'vitest';

import { XMemCache } from './x-mem-cache';

describe('XMemCache', () => {
  type TestFnParams = {
    name: string;
  };
  const fetchDataFn = async (params: TestFnParams) => {
    return {
      message: `Hello ${params.name}`,
    };
  };

  describe('XMemCache.withCache', () => {
    const lru = new TimeLruCache({
      maxSize: 50,
      defaultTTL: 5000,
    });

    const xMemCache = new XMemCache({
      lru,
      keyPrefix: 'test',
    });

    it('should execute the function and cache the result', async () => {
      const runCached = async (params: TestFnParams) => {
        return xMemCache.runAsync({
          key: ['/api/test', params],
          fn: () => fetchDataFn(params),
        });
      };

      const { data: firstRunData } = await runCached({
        name: 'test',
      });
      expect(firstRunData).toStrictEqual({ message: 'Hello test' });
      expectTypeOf(firstRunData).toEqualTypeOf<{
        message: string;
      }>();

      const { data: secondRunData } = await runCached({ name: 'test' });
      expect(secondRunData).toStrictEqual({ message: 'Hello test' });

      const removed = lru.clear();
      expect(removed).toBe(1); // One item should be removed from the cache
    });
  });
});
