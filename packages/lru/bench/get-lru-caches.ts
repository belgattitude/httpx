import { LRUCache as NodeLruCache } from 'lru-cache';
import QuickLRU from 'quick-lru';

import {
  devDependencies,
  version,
} from '../package.json' with { type: 'json' };
import { TinyLRU } from '../src';

const versions = devDependencies;

const asyncLoadCompiled = async (): Promise<typeof TinyLRU | null> => {
  return await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/lru'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.TinyLRU as unknown as typeof TinyLRU;
    })
    .catch((_e) => {
      console.warn('Requires httpx/lru to be built (yarn build)');
      return null;
    });
};

export const getLruCaches = async (params: {
  maxSize: number;
  prepopulate?: { key: string; value: string }[];
}) => {
  const LRUCacheCompiled = await asyncLoadCompiled();

  const { maxSize, prepopulate } = params;
  const caches = {
    '@httpx/lru': {
      cache: new TinyLRU({ maxSize }),
      version: version,
    },
    ...(LRUCacheCompiled
      ? {
          '@httpx/lru(compiled)': {
            cache: new LRUCacheCompiled({ maxSize }),
            version: version,
          },
        }
      : {}),
    'quick-lru': {
      cache: new QuickLRU({ maxSize }),
      version: versions['quick-lru'],
    },
    'lru-cache': {
      cache: new NodeLruCache({ max: maxSize }),
      version: versions['lru-cache'],
    },
  };
  if (Array.isArray(prepopulate)) {
    prepopulate.forEach(({ key, value }) => {
      caches['@httpx/lru'].cache.set(key, value);
      if ('@httpx/lru(compiled)' in caches) {
        caches['@httpx/lru(compiled)'].cache.set(key, value);
      }
      caches['quick-lru'].cache.set(key, value);
      caches['lru-cache'].cache.set(key, value);
    });
  }
  return caches;
};
