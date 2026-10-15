import { describe, test } from "vitest";

import { benchOptions, benchSeeds } from "../../bench-options";
import { getLruCaches } from "../../get-lru-caches";

const seeds = benchSeeds.getSeeds();

describe(`LruCache.set() ${seeds.length} items / maxSize: ${seeds.length}`, () => {
  test(`LruCache.set() ${seeds.length} items / maxSize: ${seeds.length}`, async ({
    bench,
  }) => {
    const lrus = getLruCaches({
      maxSize: seeds.length,
    });

    await bench.compare(
      bench(`@httpx/lru.set() - ts files (dev)`, () => {
        for (const { key, value } of seeds) {
          lrus["@httpx/lru"].cache.set(key, value);
        }
      }),
      bench(`quick-lru@${lrus["quick-lru"].version}.set()`, () => {
        for (const { key, value } of seeds) {
          lrus["quick-lru"].cache.set(key, value);
        }
      }),
      bench(`lru-cache@${lrus["lru-cache"].version}.set()`, () => {
        for (const { key, value } of seeds) {
          lrus["lru-cache"].cache.set(key, value);
        }
      }),
      benchOptions
    );
  });
});
