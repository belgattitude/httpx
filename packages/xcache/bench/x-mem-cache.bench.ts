import { setTimeout as sleep } from "node:timers/promises";

import { TimeLruCache } from "@httpx/lru";
import prettyBytes from "pretty-bytes";
import { describe, test } from "vitest";

import {
  CacheCompress,
  DevalueSerializer,
  JsonSerializer,
  SuperjsonSerializer,
  XMemCache,
} from "../src";
import { benchConfig } from "./bench-config";
import { generateArrayOfData } from "./data-generator";

const options = benchConfig.benchOptions;
const { isCiOrCodSpeed, rows } = benchConfig;

const waitMs = async (ms: number): Promise<void> => {
  await sleep(ms);
};

const data = generateArrayOfData(rows, false);

const asyncDataFetcher = async (params: { waitMs?: number }) => {
  if (params.waitMs !== undefined && params.waitMs > 0) {
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

describe(`XMemCache benchmarks with ${payloadSize}`, () => {
  const algorithm = "deflate";
  const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 });
  const xMemCache = new XMemCache({
    lru,
  });

  const cacheJsonGzip = new XMemCache({
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 }),
    compressor: new CacheCompress({
      algorithm,
      serializer: new JsonSerializer(),
    }),
  });

  const cacheSuperjsonGzip = new XMemCache({
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 }),
    compressor: new CacheCompress({
      algorithm,
      serializer: new SuperjsonSerializer(),
    }),
  });

  const cacheDevalueGzip = new XMemCache({
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 600_000 }),
    compressor: new CacheCompress({
      algorithm,
      serializer: new DevalueSerializer(),
    }),
  });

  test("XMemCache vs original function", async ({ bench }) => {
    await cacheJsonGzip.runAsync({
      key: ["/bench/cache-json-gzip-meta"],
      fn: () => asyncDataFetcher(defaultParams),
    });

    await bench.compare(
      bench("original function", async () => {
        const _data = await asyncDataFetcher(defaultParams);
      }),
      bench("with cache (just lru)", async () => {
        const testKey = "/bench/just-lru";
        const cachedData = lru.get(testKey);
        if (cachedData === undefined) {
          lru.set(testKey, await asyncDataFetcher(defaultParams));
        }
      }),
      bench("with cache", async () => {
        const { data: _data } = await xMemCache.runAsync({
          key: ["/bench/with-cache"],
          fn: () => asyncDataFetcher(defaultParams),
        });
      }),
      bench(`cache with json + gzip`, async () => {
        const { data: _data } = await cacheJsonGzip.runAsync({
          key: ["/bench/cache-json-gzip"],
          fn: () => asyncDataFetcher(defaultParams),
        });
      }),
      bench("cache with superjson + gzip", async () => {
        const { data: _data } = await cacheSuperjsonGzip.runAsync({
          key: ["/bench/cache-superjson-gzip"],
          fn: () => asyncDataFetcher(defaultParams),
        });
      }),
      bench("cache with devalue + gzip", async () => {
        const { data: _data } = await cacheDevalueGzip.runAsync({
          key: ["/bench/cache-devalue-gzip"],
          fn: () => asyncDataFetcher(defaultParams),
        });
      }),
      options
    );
  });
});
