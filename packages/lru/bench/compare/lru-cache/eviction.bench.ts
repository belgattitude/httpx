import { bench, describe } from 'vitest';

import { benchOptions, benchSeeds } from '../../bench-options';
import { getLruCaches } from '../../get-lru-caches';

const { lruMaxSizeHalf } = benchSeeds;

const seeds = benchSeeds.getSeeds();
const benchTtl = 6000; // 6 seconds
describe(`LruCache.set() ${seeds.length} items / maxSize: ${lruMaxSizeHalf}`, async () => {
  const lrus = await getLruCaches({
    maxSize: lruMaxSizeHalf,
  });

  bench(
    `@httpx/lru.set() - ts files (dev)`,
    () => {
      seeds.forEach(({ key, value }) =>
        lrus['@httpx/lru'].cache.set(key, value)
      );
    },
    benchOptions
  );

  bench(
    `@httpx/lru.set() - compiled (dist)`,
    () => {
      if ('@httpx/lru(compiled)' in lrus) {
        seeds.forEach(({ key, value }) =>
          lrus['@httpx/lru(compiled)']!.cache.set(key, value)
        );
      }
    },
    benchOptions
  );

  bench(
    `@httpx/time-lru.set() - compiled (dist)`,
    () => {
      seeds.forEach(({ key, value }) =>
        lrus['@httpx/time-lru(compiled)']!.cache.set(key, value, benchTtl)
      );
    },
    benchOptions
  );

  bench(
    `quick-lru@${lrus['quick-lru'].version}.set()`,
    () => {
      seeds.forEach(({ key, value }) =>
        lrus['quick-lru'].cache.set(key, value, {
          maxAge: benchTtl,
        })
      );
    },
    benchOptions
  );

  bench(
    `lru-cache@${lrus['lru-cache'].version}.set()`,
    () => {
      seeds.forEach(({ key, value }) =>
        lrus['lru-cache'].cache.set(key, value)
      );
    },
    benchOptions
  );

  bench(
    `lru-cache@${lrus['lru-cache'].version}.set(/with ttl/)`,
    () => {
      seeds.forEach(({ key, value }) =>
        lrus['lru-cache'].cache.set(key, value, {
          ttl: benchTtl,
        })
      );
    },
    benchOptions
  );
});
