import { LRUCache as NodeLruCache } from "lru-cache";
import QuickLRU from "quick-lru";

import {
  devDependencies,
  version,
} from "../package.json" with { type: "json" };
import { LruCache, TimeLruCache } from "../src";

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
