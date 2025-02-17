import { bench, describe } from 'vitest';

import { getLruCaches } from '../../get-lru-caches';

const SEEDS_COUNT = 1000;
const MAX_SIZE = 1000;

describe(`LruCache.set() ${SEEDS_COUNT} items / maxSize: ${MAX_SIZE}`, async () => {
  const seeds = Array.from({ length: SEEDS_COUNT }).map((_, i) => ({
    key: `key-${i}`,
    value: `value-${i}`,
  }));

  const lrus = await getLruCaches({
    maxSize: MAX_SIZE,
  });

  bench(`@httpx/lru.set() - ts files (dev)`, () => {
    seeds.forEach(({ key, value }) => lrus['@httpx/lru'].cache.set(key, value));
  });

  bench(`@httpx/lru.set() - compiled (dist)`, () => {
    if ('@httpx/lru(compiled)' in lrus) {
      seeds.forEach(({ key, value }) =>
        lrus['@httpx/lru(compiled)']!.cache.set(key, value)
      );
    }
  });

  bench(`@httpx/time-lru.set() - compiled (dist)`, () => {
    seeds.forEach(({ key, value }) =>
      lrus['@httpx/time-lru(compiled)']!.cache.set(key, value)
    );
  });

  bench(`quick-lru@${lrus['quick-lru'].version}.set()`, () => {
    seeds.forEach(({ key, value }) => lrus['quick-lru'].cache.set(key, value));
  });

  bench(`lru-cache@${lrus['lru-cache'].version}.set()`, () => {
    seeds.forEach(({ key, value }) => lrus['lru-cache'].cache.set(key, value));
  });
});
