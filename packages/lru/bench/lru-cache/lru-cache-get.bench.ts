import { bench, describe } from 'vitest';

import { getLruCaches } from '../get-lru-caches';

describe(`LRUCache.get comparison`, async () => {
  const SEEDS_COUNT = 1000;
  const MAX_SIZE = 500;

  const seeds = Array.from({ length: SEEDS_COUNT }).map((_, i) => ({
    key: `key-${i}`,
    value: `value-${i}`,
  }));

  const lrus = await getLruCaches({
    maxSize: MAX_SIZE,
    prepopulate: seeds,
  });

  bench(`@httpx/lru`, () => {
    seeds.forEach(({ key }) => lrus['@httpx/lru'].cache.get(key));
  });

  bench(`@httpx/lru.get() - compiled`, () => {
    if ('@httpx/lru(compiled)' in lrus) {
      seeds.forEach(({ key }) => lrus['@httpx/lru(compiled)']!.cache.get(key));
    }
  });

  bench(`quick-lru@${lrus['quick-lru'].version}.get()`, () => {
    seeds.forEach(({ key }) => lrus['quick-lru'].cache.get(key));
  });
  bench(`lru-cache@${lrus['lru-cache'].version}.get()`, () => {
    seeds.forEach(({ key }) => lrus['lru-cache'].cache.get(key));
  });
});
