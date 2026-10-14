import { bench, describe } from "vitest";

import { benchOptions, benchSeeds } from "../../bench-options";
import { getLruCaches } from "../../get-lru-caches";

const seeds = benchSeeds.getSeeds();

describe(`LruCache.set() ${seeds.length} items / maxSize: ${seeds.length}`, async () => {
  const lrus = await getLruCaches({
    maxSize: seeds.length,
  });

  bench(
    `@httpx/lru.set() - ts files (dev)`,
    () => {
      for (const { key, value } of seeds) {
        lrus["@httpx/lru"].cache.set(key, value);
      }
    },
    benchOptions
  );

  bench(
    `@httpx/lru.set() - compiled (dist)`,
    () => {
      if ("@httpx/lru(compiled)" in lrus) {
        for (const { key, value } of seeds) {
          lrus["@httpx/lru(compiled)"].cache.set(key, value);
        }
      }
    },
    benchOptions
  );

  bench(
    `@httpx/time-lru.set() - compiled (dist)`,
    () => {
      if ("@httpx/time-lru(compiled)" in lrus) {
        for (const { key, value } of seeds) {
          lrus["@httpx/time-lru(compiled)"].cache.set(key, value);
        }
      }
    },
    benchOptions
  );

  bench(
    `quick-lru@${lrus["quick-lru"].version}.set()`,
    () => {
      for (const { key, value } of seeds) {
        lrus["quick-lru"].cache.set(key, value);
      }
    },
    benchOptions
  );

  bench(
    `lru-cache@${lrus["lru-cache"].version}.set()`,
    () => {
      for (const { key, value } of seeds) {
        lrus["lru-cache"].cache.set(key, value);
      }
    },
    benchOptions
  );
});
