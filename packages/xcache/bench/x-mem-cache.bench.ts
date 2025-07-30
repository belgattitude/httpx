import { TimeLruCache } from '@httpx/lru';
import { bench } from 'vitest';

import { XMemCache } from '../src';

const options: Parameters<typeof bench>[2] = {
  time: 10,
};

const asyncDataFetcher = async (params: { id: number }) => {
  return { id: params.id, data: `Data for ${params.id}` };
};

describe('XMemCache benchmarks', () => {
  const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 5000 });
  const xMemCache = new XMemCache({ lru });

  const params = { id: 1 };

  bench(
    'original function',
    async () => {
      const { data: _data } = await asyncDataFetcher(params);
    },
    options
  );

  bench(
    'with cache (just lru)',
    async () => {
      const testKey = 'just-lru-test-key';
      const cachedData = lru.get(testKey);
      if (!cachedData) {
        lru.set(testKey, await asyncDataFetcher(params));
      }
    },
    options
  );

  bench(
    'with cache',
    async () => {
      const { data: _data } = await xMemCache.runAsync({
        key: ['/bench/data', params],
        fn: () => asyncDataFetcher(params),
      });
    },
    options
  );
});
