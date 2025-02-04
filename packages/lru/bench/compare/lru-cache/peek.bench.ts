import { bench, describe } from 'vitest';

import { getLruCaches } from '../../get-lru-caches';

const SEEDS_COUNT = 1000;
const MAX_SIZE = 500;

describe(`LRUCache.peek() - ${SEEDS_COUNT} items / maxSize: ${MAX_SIZE}`, async () => {
  const seeds = Array.from({ length: SEEDS_COUNT }).map((_, i) => ({
    key: `key-${i}`,
    value: `value-${i}`,
  }));

  const lrus = await getLruCaches({
    maxSize: MAX_SIZE,
    prepopulate: seeds,
  });

  bench(`@httpx/lru.peek() - ts files (dev)`, () => {
    seeds.forEach(({ key }) => lrus['@httpx/lru'].cache.peek(key));
  });

  bench(`@httpx/lru.peek() - compiled (dist)`, () => {
    if ('@httpx/lru(compiled)' in lrus) {
      seeds.forEach(({ key }) => lrus['@httpx/lru(compiled)']!.cache.peek(key));
    }
  });

  bench(`quick-lru@${lrus['quick-lru'].version}.peek()`, () => {
    seeds.forEach(({ key }) => lrus['quick-lru'].cache.peek(key));
  });

  bench(`lru-cache@${lrus['lru-cache'].version}.peek()`, () => {
    seeds.forEach(({ key }) => lrus['lru-cache'].cache.peek(key));
  });
});
