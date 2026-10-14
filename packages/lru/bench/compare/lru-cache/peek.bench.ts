import { bench, describe } from "vitest";

import { benchOptions, benchSeeds } from "../../bench-options";
import { getLruCaches } from "../../get-lru-caches";

const seeds = benchSeeds.getSeeds();

describe(`LruCache.peek() - ${seeds.length} items / maxSize: ${seeds.length}`, async () => {
  const lrus = await getLruCaches({
    maxSize: seeds.length,
    prepopulate: seeds,
  });

  bench(
    `@httpx/lru.peek() - ts files (dev)`,
    () => {
      for (const { key } of seeds) {
        lrus["@httpx/lru"].cache.peek(key);
      }
    },
    benchOptions
  );

  bench(
    `@httpx/lru.peek() - compiled (dist)`,
    () => {
      if ("@httpx/lru(compiled)" in lrus) {
        for (const { key } of seeds) {
          lrus["@httpx/lru(compiled)"].cache.peek(key);
        }
      }
    },
    benchOptions
  );

  bench(
    `quick-lru@${lrus["quick-lru"].version}.peek()`,
    () => {
      for (const { key } of seeds) {
        lrus["quick-lru"].cache.peek(key);
      }
    },
    benchOptions
  );

  bench(
    `lru-cache@${lrus["lru-cache"].version}.peek()`,
    () => {
      for (const { key } of seeds) {
        lrus["lru-cache"].cache.peek(key);
      }
    },
    benchOptions
  );
});
