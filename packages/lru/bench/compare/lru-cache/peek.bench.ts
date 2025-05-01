import { bench, describe } from 'vitest';

import { benchOptions, benchSeeds } from '../../bench-options';
import { getLruCaches } from '../../get-lru-caches';

const seeds = benchSeeds.getSeeds();

describe(`LruCache.peek() - ${seeds.length} items / maxSize: ${seeds.length}`, async () => {
  const lrus = await getLruCaches({
    maxSize: seeds.length,
    prepopulate: seeds,
  });

  bench(
    `@httpx/lru.peek() - ts files (dev)`,
    () => {
      seeds.forEach(({ key }) => lrus['@httpx/lru'].cache.peek(key));
    },
    benchOptions
  );

  bench(
    `@httpx/lru.peek() - compiled (dist)`,
    () => {
      if ('@httpx/lru(compiled)' in lrus) {
        seeds.forEach(({ key }) =>
          lrus['@httpx/lru(compiled)']!.cache.peek(key)
        );
      }
    },
    benchOptions
  );

  bench(
    `quick-lru@${lrus['quick-lru'].version}.peek()`,
    () => {
      seeds.forEach(({ key }) => lrus['quick-lru'].cache.peek(key));
    },
    benchOptions
  );

  bench(
    `lru-cache@${lrus['lru-cache'].version}.peek()`,
    () => {
      seeds.forEach(({ key }) => lrus['lru-cache'].cache.peek(key));
    },
    benchOptions
  );
});
