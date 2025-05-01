import { bench, describe } from 'vitest';

import { benchOptions, benchSeeds } from '../../bench-options';
import { getLruCaches } from '../../get-lru-caches';

const { lruMaxSize } = benchSeeds;

const seeds = benchSeeds.getSeeds();

describe(`LruCache.get() - ${seeds.length} items / maxSize: ${lruMaxSize}`, async () => {
  const lrus = await getLruCaches({
    maxSize: lruMaxSize,
    prepopulate: seeds,
  });

  bench(
    `@httpx/lru.get() - ts files (dev)`,
    () => {
      seeds.forEach(({ key }) => lrus['@httpx/lru'].cache.get(key));
    },
    benchOptions
  );

  bench(
    `@httpx/lru.get() - compiled (dist)`,
    () => {
      if ('@httpx/lru(compiled)' in lrus) {
        seeds.forEach(({ key }) =>
          lrus['@httpx/lru(compiled)']!.cache.get(key)
        );
      }
    },
    benchOptions
  );

  bench(
    `@httpx/time-lru.get() - ts files (dev)`,
    () => {
      seeds.forEach(({ key }) => lrus['@httpx/time-lru'].cache.get(key));
    },
    benchOptions
  );

  bench(
    `@httpx/time-lru.get() - compiled (dist)`,
    () => {
      seeds.forEach(({ key }) =>
        lrus['@httpx/time-lru(compiled)']!.cache.get(key)
      );
    },
    benchOptions
  );

  bench(
    `quick-lru@${lrus['quick-lru'].version}.get()`,
    () => {
      seeds.forEach(({ key }) => lrus['quick-lru'].cache.get(key));
    },
    benchOptions
  );

  bench(
    `lru-cache@${lrus['lru-cache'].version}.get()`,
    () => {
      seeds.forEach(({ key }) => lrus['lru-cache'].cache.get(key));
    },
    benchOptions
  );
});
