import { describe, test } from "vitest";

import { benchOptions, benchSeeds } from "../../bench-options";
import { getLruCaches } from "../../get-lru-caches";

const { lruMaxSizeHalf } = benchSeeds;

const seeds = benchSeeds.getSeeds();
const benchTtl = 6000; // 6 seconds
describe(`LruCache.set() ${seeds.length} items / maxSize: ${lruMaxSizeHalf}`, () => {
  test(`LruCache.set() ${seeds.length} items / maxSize: ${lruMaxSizeHalf}`, async ({
    bench,
  }) => {
    const lrus = getLruCaches({
      maxSize: lruMaxSizeHalf,
    });

    await bench.compare(
      bench(`@httpx/lru.set() - ts files (dev)`, () => {
        for (const { key, value } of seeds) {
          lrus["@httpx/lru"].cache.set(key, value);
        }
      }),
      bench(`@httpx/time-lru.set() - ts file (dev)`, () => {
        for (const { key, value } of seeds) {
          lrus["@httpx/time-lru"].cache.set(key, value, benchTtl);
        }
      }),
      bench(`quick-lru@${lrus["quick-lru"].version}.set()`, () => {
        for (const { key, value } of seeds) {
          lrus["quick-lru"].cache.set(key, value, { maxAge: benchTtl });
        }
      }),
      bench(`lru-cache@${lrus["lru-cache"].version}.set()`, () => {
        for (const { key, value } of seeds) {
          lrus["lru-cache"].cache.set(key, value);
        }
      }),
      bench(`lru-cache@${lrus["lru-cache"].version}.set(/with ttl/)`, () => {
        for (const { key, value } of seeds) {
          lrus["lru-cache"].cache.set(key, value, { ttl: benchTtl });
        }
      }),
      benchOptions
    );
  });
});
