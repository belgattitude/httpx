import { describe, test } from "vitest";

import { benchOptions, benchSeeds } from "../../bench-options";
import { getLruCaches } from "../../get-lru-caches";

const seeds = benchSeeds.getSeeds();

describe(`LruCache.peek() - ${seeds.length} items / maxSize: ${seeds.length}`, () => {
  test(`LruCache.peek() - ${seeds.length} items / maxSize: ${seeds.length}`, async ({
    bench,
  }) => {
    const lrus = getLruCaches({
      maxSize: seeds.length,
      prepopulate: seeds,
    });

    await bench.compare(
      bench(`@httpx/lru.peek() - ts files (dev)`, () => {
        for (const { key } of seeds) {
          lrus["@httpx/lru"].cache.peek(key);
        }
      }),
      bench(`quick-lru@${lrus["quick-lru"].version}.peek()`, () => {
        for (const { key } of seeds) {
          lrus["quick-lru"].cache.peek(key);
        }
      }),
      bench(`lru-cache@${lrus["lru-cache"].version}.peek()`, () => {
        for (const { key } of seeds) {
          lrus["lru-cache"].cache.peek(key);
        }
      }),
      benchOptions
    );
  });
});
