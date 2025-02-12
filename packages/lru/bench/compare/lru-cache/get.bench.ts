import { bench, describe } from 'vitest';

import { getLruCaches } from '../../get-lru-caches';

const SEEDS_COUNT = 1000;
const MAX_SIZE = 500;

describe(`LruCache.get() - ${SEEDS_COUNT} items / maxSize: ${MAX_SIZE}`, async () => {
  const seeds = Array.from({ length: SEEDS_COUNT }).map((_, i) => ({
    key: `key-${i}`,
    value: `value-${i}`,
  }));

  const lrus = await getLruCaches({
    maxSize: MAX_SIZE,
    prepopulate: seeds,
  });

  bench(`@httpx/lru.get() - ts files (dev)`, () => {
    seeds.forEach(({ key }) => lrus['@httpx/lru'].cache.get(key));
  });

  bench(`@httpx/lru.get() - compiled (dist)`, () => {
    if ('@httpx/lru(compiled)' in lrus) {
      seeds.forEach(({ key }) => lrus['@httpx/lru(compiled)']!.cache.get(key));
    }
  });

  bench(`@httpx/time-lru.get() - ts files (dev)`, () => {
    seeds.forEach(({ key }) => lrus['@httpx/lru-time'].cache.get(key));
  });

  bench(`quick-lru@${lrus['quick-lru'].version}.get()`, () => {
    seeds.forEach(({ key }) => lrus['quick-lru'].cache.get(key));
  });

  bench(`lru-cache@${lrus['lru-cache'].version}.get()`, () => {
    seeds.forEach(({ key }) => lrus['lru-cache'].cache.get(key));
  });
});
