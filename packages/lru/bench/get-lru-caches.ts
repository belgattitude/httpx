import { LRUCache as NodeLruCache } from 'lru-cache';
import QuickLRU from 'quick-lru';

import {
  devDependencies,
  version,
} from '../package.json' with { type: 'json' };
import { LruCache, TimeLruCache } from '../src';

const versions = devDependencies;

const asyncLoadCompiledLruCache = async (): Promise<typeof LruCache | null> => {
  return await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/lru'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.LruCache as unknown as typeof LruCache;
    })
    .catch((_e) => {
      console.warn('Requires httpx/lru to be built (yarn build)');
      return null;
    });
};

const asyncLoadCompiledTimeLruCache = async (): Promise<
  typeof TimeLruCache | null
> => {
  return await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/lru'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.TimeLruCache as unknown as typeof TimeLruCache;
    })
    .catch((_e) => {
      console.warn('Requires httpx/lru to be built (yarn build)');
      return null;
    });
};

const EIGHT_SECONDS = 8000;

export const getLruCaches = async (params: {
  maxSize: number;
  prepopulate?: { key: string; value: string }[];
}) => {
  const LruCacheCompiled = await asyncLoadCompiledLruCache();
  const TimeLruCacheCompiled = await asyncLoadCompiledTimeLruCache();

  const { maxSize, prepopulate } = params;
  const caches = {
    '@httpx/lru': {
      cache: new LruCache({ maxSize }),
      version: version,
    },
    '@httpx/time-lru': {
      cache: new TimeLruCache({ maxSize, defaultTTL: EIGHT_SECONDS }),
      version: version,
    },
    ...(LruCacheCompiled
      ? {
          '@httpx/lru(compiled)': {
            cache: new LruCacheCompiled({ maxSize }),
            version: version,
          },
        }
      : {}),
    ...(TimeLruCacheCompiled
      ? {
          '@httpx/time-lru(compiled)': {
            cache: new TimeLruCacheCompiled({
              maxSize,
              defaultTTL: EIGHT_SECONDS,
            }),
            version: version,
          },
        }
      : {}),
    'quick-lru': {
      cache: new QuickLRU({ maxSize }),
      version: versions['quick-lru'],
    },
    'lru-cache': {
      cache: new NodeLruCache({ max: maxSize, ttl: 1000 * 60 * 5 }),
      version: versions['lru-cache'],
    },
  };
  if (Array.isArray(prepopulate)) {
    prepopulate.forEach(({ key, value }) => {
      caches['@httpx/lru'].cache.set(key, value);
      caches['@httpx/time-lru'].cache.set(key, value, EIGHT_SECONDS);
      if ('@httpx/lru(compiled)' in caches) {
        caches['@httpx/lru(compiled)'].cache.set(key, value);
      }
      if ('@httpx/time-lru(compiled)' in caches) {
        caches['@httpx/time-lru(compiled)'].cache.set(
          key,
          value,
          EIGHT_SECONDS
        );
      }
      caches['quick-lru'].cache.set(key, value, {
        maxAge: EIGHT_SECONDS,
      });
      caches['lru-cache'].cache.set(key, value, {
        ttl: EIGHT_SECONDS,
      });
    });
  }
  return caches;
};
