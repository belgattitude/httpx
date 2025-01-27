import { bench, describe } from 'vitest';

import { getLruCaches } from './get-lru-caches';

describe(`LRU.set comparison`, async () => {
  const seeds = Array.from({ length: 1000 }).map((_, i) => ({
    key: `key-${i}`,
    value: `value-${i}`,
  }));

  const lrus = await getLruCaches({
    maxSize: 500,
  });

  bench(`@httpx/lru@${lrus['@httpx/lru'].version}`, () => {
    seeds.forEach(({ key, value }) => lrus['@httpx/lru'].cache.set(key, value));
  });

  bench(
    `@httpx/lru@${lrus['@httpx/lru(compiled)']?.version ?? 'N/A'} - compiled`,
    () => {
      if ('@httpx/lru(compiled)' in lrus) {
        seeds.forEach(({ key, value }) =>
          lrus['@httpx/lru(compiled)']!.cache.set(key, value)
        );
      }
    }
  );

  bench(`quick-lru@${lrus['quick-lru'].version}`, () => {
    seeds.forEach(({ key, value }) => lrus['quick-lru'].cache.set(key, value));
  });

  bench(`lru-cache@${lrus['lru-cache'].version}`, () => {
    seeds.forEach(({ key, value }) => lrus['lru-cache'].cache.set(key, value));
  });
});
