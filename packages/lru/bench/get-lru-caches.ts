import { LRUCache as NodeLruCache } from 'lru-cache';
import QuickLRU from 'quick-lru';

import {
  devDependencies,
  version,
} from '../package.json' with { type: 'json' };
import { LRUCache, TimeLRUCache } from '../src';

const versions = devDependencies;

const asyncLoadCompiled = async (): Promise<typeof LRUCache | null> => {
  return await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/lru'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.LRUCache as unknown as typeof LRUCache;
    })
    .catch((_e) => {
      console.warn('Requires httpx/lru to be built (yarn build)');
      return null;
    });
};

const TWO_SECONDS = 2000;

export const getLruCaches = async (params: {
  maxSize: number;
  prepopulate?: { key: string; value: string }[];
}) => {
  const LRUCacheCompiled = await asyncLoadCompiled();

  const { maxSize, prepopulate } = params;
  const caches = {
    '@httpx/lru': {
      cache: new LRUCache({ maxSize }),
      version: version,
    },
    '@httpx/lru-time': {
      cache: new TimeLRUCache({ maxSize, defaultTTL: TWO_SECONDS }),
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
      caches['@httpx/lru-time'].cache.set(key, value);
      if ('@httpx/lru(compiled)' in caches) {
        caches['@httpx/lru(compiled)'].cache.set(key, value);
      }
      caches['quick-lru'].cache.set(key, value);
      caches['lru-cache'].cache.set(key, value);
    });
  }
  return caches;
};
