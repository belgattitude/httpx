import { describe, test } from "vitest";

import { benchOptions, benchSeeds } from "../../bench-options";
import { getLruCaches } from "../../get-lru-caches";

const { lruMaxSize } = benchSeeds;

const seeds = benchSeeds.getSeeds();

describe(`LruCache.get() - ${seeds.length} items / maxSize: ${lruMaxSize}`, () => {
  test(`LruCache.get() - ${seeds.length} items / maxSize: ${lruMaxSize}`, async ({
    bench,
  }) => {
    const lrus = getLruCaches({
      maxSize: lruMaxSize,
      prepopulate: seeds,
    });

    await bench.compare(
      bench(`@httpx/lru.get() - ts files (dev)`, () => {
        for (const { key } of seeds) {
          lrus["@httpx/lru"].cache.get(key);
        }
      }),
      bench(`@httpx/time-lru.get() - ts files (dev)`, () => {
        for (const { key } of seeds) {
          lrus["@httpx/time-lru"].cache.get(key);
        }
      }),
      bench(`quick-lru@${lrus["quick-lru"].version}.get()`, () => {
        for (const { key } of seeds) {
          lrus["quick-lru"].cache.get(key);
        }
      }),
      bench(`lru-cache@${lrus["lru-cache"].version}.get()`, () => {
        for (const { key } of seeds) {
          lrus["lru-cache"].cache.get(key);
        }
      }),
      benchOptions
    );
  });
});
