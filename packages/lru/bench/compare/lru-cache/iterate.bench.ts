import { bench, describe } from 'vitest';

import { getLruCaches } from '../../get-lru-caches';

const SEEDS_COUNT = 1000;

describe(`LruCache iterator - ${SEEDS_COUNT} items`, async () => {
  const seeds = Array.from({ length: SEEDS_COUNT }).map((_, i) => ({
    key: `key-${i}`,
    value: `value-${i}`,
  }));

  const lrus = await getLruCaches({
    maxSize: seeds.length,
    prepopulate: seeds,
  });

  bench(`@httpx/lru - forEach - ts files (dev)`, () => {
    const results: string[] = [];
    for (const [key, _value] of lrus['@httpx/lru'].cache) {
      results.push(key);
    }
  });

  bench(`@httpx/lru - forEach - compiled (dist)`, () => {
    if ('@httpx/lru(compiled)' in lrus) {
      const results: string[] = [];
      for (const [key, _value] of lrus['@httpx/lru(compiled)'].cache) {
        results.push(key);
      }
    }
  });

  bench(`quick-lru@${lrus['quick-lru'].version} - forEach`, () => {
    const results: string[] = [];
    for (const [key, _value] of lrus['quick-lru'].cache.entriesAscending()) {
      results.push(key as string);
    }
  });

  bench(`lru-cache@${lrus['lru-cache'].version} - forEach`, () => {
    const results: string[] = [];
    for (const [key, _value] of lrus['lru-cache'].cache.entries()) {
      results.push(key as string);
    }
  });
});
