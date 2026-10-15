import { LRUCache as NodeLruCache } from "lru-cache";
import QuickLRU from "quick-lru";

import {
  devDependencies,
  version,
} from "../package.json" with { type: "json" };
import type * as LruSources from "../src";

/**
 * The built files (`pnpm build`), not `../src` nor the `@httpx/lru` package
 * name (resolved to the sources by the `httpx-monorepo-source` condition):
 * vitest runs the sources through the vite module runner, where every internal
 * import is a getter that adds overhead to the measures.
 * @link https://vitest.dev/guide/benchmarking#module-runner-overhead
 */
const { LruCache, TimeLruCache } = (await import(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore the dist only exists once built
  "../dist/index.js"
).catch((error: unknown) => {
  throw new Error(
    "The benchmarks require @httpx/lru to be built (pnpm build)",
    {
      cause: error,
    }
  );
})) as unknown as typeof LruSources;

const versions = devDependencies;

const EIGHT_SECONDS = 8000;

export const getLruCaches = (params: {
  maxSize: number;
  prepopulate?: { key: string; value: string }[];
}) => {
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
