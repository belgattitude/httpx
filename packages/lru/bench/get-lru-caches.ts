import { LRUCache as NodeLruCache } from "lru-cache";
import QuickLRU from "quick-lru";

import {
  devDependencies,
  version,
} from "../package.json" with { type: "json" };
import { LruCache, TimeLruCache } from "../src";

const versions = devDependencies;

const asyncLoadCompiledLruCache = async (): Promise<typeof LruCache | null> =>
  await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    "@httpx/lru"
  )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore this won't generally work if the project isn't built or built
    .then((mod: { LruCache: typeof LruCache }) => mod.LruCache)
    .catch((_e: unknown) => {
      console.warn("Requires httpx/lru to be built (pnpm build)");
      return null;
    });

const asyncLoadCompiledTimeLruCache = async (): Promise<
  typeof TimeLruCache | null
> =>
  await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    "@httpx/lru"
  )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore this won't generally work if the project isn't built or built
    .then((mod: { TimeLruCache: typeof TimeLruCache }) => mod.TimeLruCache)
    .catch((_e: unknown) => {
      console.warn("Requires httpx/lru to be built (pnpm build)");
      return null;
    });

const EIGHT_SECONDS = 8000;

export const getLruCaches = async (params: {
  maxSize: number;
  prepopulate?: { key: string; value: string }[];
}) => {
  const LruCacheCompiled = await asyncLoadCompiledLruCache();
  const TimeLruCacheCompiled = await asyncLoadCompiledTimeLruCache();

  const { maxSize, prepopulate } = params;
  const caches = {
    "@httpx/lru": {
      cache: new LruCache({ maxSize }),
      version,
    },
    "@httpx/time-lru": {
      cache: new TimeLruCache({ maxSize, defaultTTL: EIGHT_SECONDS }),
      version,
    },
    ...(LruCacheCompiled
      ? {
          "@httpx/lru(compiled)": {
            cache: new LruCacheCompiled({ maxSize }),
            version,
          },
        }
      : {}),
    ...(TimeLruCacheCompiled
      ? {
          "@httpx/time-lru(compiled)": {
            cache: new TimeLruCacheCompiled({
              maxSize,
              defaultTTL: EIGHT_SECONDS,
            }),
            version,
          },
        }
      : {}),
    "quick-lru": {
      cache: new QuickLRU({ maxSize }),
      version: versions["quick-lru"],
    },
    "lru-cache": {
      cache: new NodeLruCache({ max: maxSize, ttl: 1000 * 60 * 5 }),
      version: versions["lru-cache"],
    },
  };
  if (Array.isArray(prepopulate)) {
    for (const { key, value } of prepopulate) {
      caches["@httpx/lru"].cache.set(key, value);
      caches["@httpx/time-lru"].cache.set(key, value, EIGHT_SECONDS);
      if ("@httpx/lru(compiled)" in caches) {
        caches["@httpx/lru(compiled)"].cache.set(key, value);
      }
      if ("@httpx/time-lru(compiled)" in caches) {
        caches["@httpx/time-lru(compiled)"].cache.set(
          key,
          value,
          EIGHT_SECONDS
        );
      }
      caches["quick-lru"].cache.set(key, value, {
        maxAge: EIGHT_SECONDS,
      });
      caches["lru-cache"].cache.set(key, value, {
        ttl: EIGHT_SECONDS,
      });
    }
  }
  return caches;
};
