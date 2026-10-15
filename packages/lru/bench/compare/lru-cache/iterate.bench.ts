import { describe, test } from "vitest";

import { benchOptions, benchSeeds } from "../../bench-options";
import { getLruCaches } from "../../get-lru-caches";

const seeds = benchSeeds.getSeeds();

describe(`LruCache iterator - ${seeds.length} items`, () => {
  test(`LruCache iterator - ${seeds.length} items`, async ({ bench }) => {
    const lrus = getLruCaches({
      maxSize: seeds.length,
      prepopulate: seeds,
    });

    await bench.compare(
      bench(`@httpx/lru - forEach - ts files (dev)`, () => {
        const results: string[] = [];
        for (const [key, _value] of lrus["@httpx/lru"].cache) {
          results.push(key);
        }
      }),
      bench(`quick-lru@${lrus["quick-lru"].version} - forEach`, () => {
        const results: string[] = [];
        for (const [key, _value] of lrus[
          "quick-lru"
        ].cache.entriesAscending()) {
          results.push(key as string);
        }
      }),
      bench(`lru-cache@${lrus["lru-cache"].version} - forEach`, () => {
        const results: string[] = [];
        for (const [key, _value] of lrus["lru-cache"].cache.entries()) {
          results.push(key as string);
        }
      }),
      benchOptions
    );
  });
});
