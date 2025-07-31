import { TimeLruCache } from '@httpx/lru';
import prettyBytes from 'pretty-bytes';
import { bench } from 'vitest';

import {
  CacheCompress,
  DevalueSerializer,
  JsonSerializer,
  SuperjsonSerializer,
  XMemCache,
} from '../src';
import { benchConfig } from './bench-config';
import { generateArrayOfData } from './data-generator';

const options = benchConfig.benchOptions;
const { isCiOrCodSpeed } = benchConfig;
const rows = isCiOrCodSpeed ? 1000 : 500_000; // Adjust rows based on environment

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const data = generateArrayOfData(rows, false);

const asyncDataFetcher = async (params: { waitMs?: number }) => {
  if (params.waitMs && params.waitMs > 0) {
    await waitMs(params.waitMs);
  }
  return {
    rows: data,
  };
};

const payloadSize = prettyBytes(
  JSON.stringify(await asyncDataFetcher({ waitMs: 0 })).length
);

const defaultParams = {
  waitMs: isCiOrCodSpeed ? 100 : 400,
} as const;

describe(`XMemCache benchmarks with ${payloadSize}`, async () => {
  const algorithm = 'deflate';
  const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 });
  const xMemCache = new XMemCache({
    lru,
  });
  bench(
    'original function',
    async () => {
      const _data = await asyncDataFetcher(defaultParams);
    },
    options
  );

  bench(
    'with cache (just lru)',
    async () => {
      const testKey = '/bench/just-lru';
      const cachedData = lru.get(testKey);
      if (cachedData === undefined) {
        lru.set(testKey, await asyncDataFetcher(defaultParams));
      }
    },
    options
  );

  bench(
    'with cache',
    async () => {
      const { data: _data } = await xMemCache.runAsync({
        key: ['/bench/with-cache'],
        fn: () => asyncDataFetcher(defaultParams),
      });
    },
    options
  );

  const cacheJsonGzip = new XMemCache({
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 }),
    compressor: new CacheCompress({
      algorithm,
      serializer: new JsonSerializer(),
    }),
  });

  const { meta } = await cacheJsonGzip.runAsync({
    key: ['/bench/cache-json-gzip-meta'],
    fn: () => asyncDataFetcher(defaultParams),
  });

  bench(
    `cache with json + gzip`,
    async () => {
      const { data: _data } = await cacheJsonGzip.runAsync({
        key: ['/bench/cache-json-gzip'],
        fn: () => asyncDataFetcher(defaultParams),
      });
    },
    options
  );

  const cacheSuperjsonGzip = new XMemCache({
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 }),
    compressor: new CacheCompress({
      algorithm,
      serializer: new SuperjsonSerializer(),
    }),
  });

  bench(
    'cache with superjson + gzip',
    async () => {
      const { data: _data } = await cacheSuperjsonGzip.runAsync({
        key: ['/bench/cache-superjson-gzip'],
        fn: () => asyncDataFetcher(defaultParams),
      });
    },
    options
  );
  const cacheDevalueGzip = new XMemCache({
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 }),
    compressor: new CacheCompress({
      algorithm,
      serializer: new DevalueSerializer(),
    }),
  });

  bench(
    'cache with devalue + gzip',
    async () => {
      const { data: _data } = await cacheDevalueGzip.runAsync({
        key: ['/bench/cache-devalue-gzip'],
        fn: () => asyncDataFetcher(defaultParams),
      });
    },
    options
  );
});
