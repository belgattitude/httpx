import { TimeLruCache } from '@httpx/lru';
import { expect, expectTypeOf } from 'vitest';

import { CacheGzip } from '../compress/cache-gzip';
import { DevalueSerializer } from '../serializer/devalue-serializer';
import { XMemCache } from '../x-mem-cache';

describe('XMemCache compression', () => {
  const payload = {
    message: `Hello world &à`.repeat(50),
    bigint: BigInt('1234567890123456789012345678901234567890'),
    date: new Date(),
    test: ['10', 1, true, null, undefined],
  };

  const fetchDataFn = async () => {
    return payload;
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
      const runCached = async () => {
        return xMemCache.runAsync({
          key: ['/api/compression-test'],
          fn: () => fetchDataFn(),
        });
      };

      const { data: firstRunData, meta: firstRunMeta } = await runCached();
      expect(firstRunData).toStrictEqual(payload);
      expectTypeOf(firstRunData).toEqualTypeOf<typeof payload>();

      expect(firstRunMeta.cached).toStrictEqual(false);
      expect(firstRunMeta.generatedKey).toStrictEqual(
        '{"compressorId":"cache-gzip:devalue","key":["/api/compression-test"],"ns":"default"}'
      );
      expect(lru.size).toStrictEqual(1);

      const { data: secondRunData } = await runCached();
      expect(secondRunData).toStrictEqual(payload);
      expect(lru.size).toStrictEqual(1);

      const removed = lru.clear();
      expect(removed).toBe(1); // One item should be removed from the cache
    });
  });
});
