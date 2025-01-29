import { bench, describe } from 'vitest';

import { getLruCaches } from '../get-lru-caches';

describe(`BaseLru.set comparison`, async () => {
  const seeds = Array.from({ length: 1000 }).map((_, i) => ({
    key: `key-${i}`,
    value: `value-${i}`,
  }));

  const lrus = await getLruCaches({
    maxSize: 500,
  });

  bench(`@httpx/lru.set()`, () => {
    seeds.forEach(({ key, value }) => lrus['@httpx/lru'].cache.set(key, value));
  });

  bench(`@httpx/lru.set() - compiled`, () => {
    if ('@httpx/lru(compiled)' in lrus) {
      seeds.forEach(({ key, value }) =>
        lrus['@httpx/lru(compiled)']!.cache.set(key, value)
      );
    }
  });

  bench(`quick-lru@${lrus['quick-lru'].version}.set()`, () => {
    seeds.forEach(({ key, value }) => lrus['quick-lru'].cache.set(key, value));
  });

  bench(`lru-cache@${lrus['lru-cache'].version}.set()`, () => {
    seeds.forEach(({ key, value }) => lrus['lru-cache'].cache.set(key, value));
  });
});
