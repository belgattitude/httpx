import { bench, describe } from 'vitest';

import { benchOptions, benchSeeds } from '../../bench-options';
import { getLruCaches } from '../../get-lru-caches';

const seeds = benchSeeds.getSeeds();

describe(`LruCache iterator - ${seeds.length} items`, async () => {
  const lrus = await getLruCaches({
    maxSize: seeds.length,
    prepopulate: seeds,
  });

  bench(
    `@httpx/lru - forEach - ts files (dev)`,
    () => {
      const results: string[] = [];
      for (const [key, _value] of lrus['@httpx/lru'].cache) {
        results.push(key);
      }
    },
    benchOptions
  );

  bench(
    `@httpx/lru - forEach - compiled (dist)`,
    () => {
      if ('@httpx/lru(compiled)' in lrus) {
        const results: string[] = [];
        for (const [key, _value] of lrus['@httpx/lru(compiled)'].cache) {
          results.push(key);
        }
      }
    },
    benchOptions
  );

  bench(
    `quick-lru@${lrus['quick-lru'].version} - forEach`,
    () => {
      const results: string[] = [];
      for (const [key, _value] of lrus['quick-lru'].cache.entriesAscending()) {
        results.push(key as string);
      }
    },
    benchOptions
  );

  bench(
    `lru-cache@${lrus['lru-cache'].version} - forEach`,
    () => {
      const results: string[] = [];
      for (const [key, _value] of lrus['lru-cache'].cache.entries()) {
        results.push(key as string);
      }
    },
    benchOptions
  );
});
