import { TimeLruCache } from '@httpx/lru';
import { expect, expectTypeOf } from 'vitest';

import { XMemCache } from '../x-mem-cache';

describe('XMemCache', () => {
  type TestFnParams = {
    name: string;
  };
  const fetchDataFn = async (params: TestFnParams) => {
    return {
      message: `Hello ${params.name}`,
    };
  };

  describe('XMemCache.runAsync', () => {
    const lru = new TimeLruCache({
      maxSize: 50,
      defaultTTL: 50_000,
    });

    const xMemCache = new XMemCache({ lru });

    it('should execute the function and cache the result', async () => {
      const fn = vi.fn();
      const runCached = async (params: TestFnParams) => {
        return xMemCache.runAsync({
          key: ['/api/test', params],
          fn: () => {
            fn();
            return fetchDataFn(params);
          },
        });
      };

      const { data: firstRunData, meta: firstRunMeta } = await runCached({
        name: 'test',
      });
      expect(firstRunData).toStrictEqual({ message: 'Hello test' });
      expectTypeOf(firstRunData).toEqualTypeOf<{
        message: string;
      }>();

      expect(firstRunMeta.cached).toStrictEqual(false);
      expect(firstRunMeta.generatedKey).toStrictEqual(
        '{"key":["/api/test",{"name":"test"}],"ns":"default"}'
      );
      expect(lru.size).toStrictEqual(1);

      const { data: secondRunData } = await runCached({ name: 'test' });
      expect(secondRunData).toStrictEqual({ message: 'Hello test' });
      expect(lru.size).toStrictEqual(1);

      const removed = lru.clear();
      expect(removed).toBe(1); // One item should be removed from the cache
      expect(fn).toHaveBeenCalledExactlyOnceWith();
    });
  });
});
