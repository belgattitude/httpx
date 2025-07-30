import { TimeLruCache } from '@httpx/lru';
import { expect, expectTypeOf } from 'vitest';

import { CacheGzip } from '../compress/cache-gzip';
import { DevalueSerializer } from '../serializer/devalue-serializer';
import { XMemCache } from '../x-mem-cache';

describe('XMemCache compression', () => {
  type TestFnParams = {
    name: string;
  };

  const today = new Date();
  const myBigInt = BigInt('1234567890123456789012345678901234567890');

  const fetchDataFn = async (params: TestFnParams) => {
    return {
      message: `Hello ${params.name}`,
      bigint: myBigInt,
      date: today,
    };
  };

  describe('XMemCache.runAsync', () => {
    const lru = new TimeLruCache({
      maxSize: 50,
      defaultTTL: 10_000,
    });

    const xMemCache = new XMemCache({
      lru,
      compressor: new CacheGzip({
        serializer: new DevalueSerializer(),
      }),
    });

    it('should execute the function and cache the result', async () => {
      const runCached = async (params: TestFnParams) => {
        return xMemCache.runAsync({
          key: ['/api/test', params],
          fn: () => fetchDataFn(params),
        });
      };

      const { data: firstRunData, meta: firstRunMeta } = await runCached({
        name: 'test',
      });
      expect(firstRunData).toStrictEqual({
        message: 'Hello test',
        bigint: myBigInt,
        date: today,
      });
      expectTypeOf(firstRunData).toEqualTypeOf<{
        message: string;
        bigint: bigint;
        date: Date;
      }>();

      expect(firstRunMeta.cached).toStrictEqual(false);
      expect(firstRunMeta.generatedKey).toStrictEqual(
        '{"compressorId":"cache-gzip:devalue","key":["/api/test",{"name":"test"}],"ns":"default"}'
      );
      expect(lru.size).toStrictEqual(1);

      const { data: secondRunData } = await runCached({ name: 'test' });
      expect(secondRunData).toStrictEqual({
        message: 'Hello test',
        bigint: myBigInt,
        date: today,
      });
      expect(lru.size).toStrictEqual(1);

      const removed = lru.clear();
      expect(removed).toBe(1); // One item should be removed from the cache
    });
  });
});
