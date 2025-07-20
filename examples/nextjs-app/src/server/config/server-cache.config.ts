import { TimeLruCache } from '@httpx/lru';

const timeLru = new TimeLruCache<string>({
  maxSize: 100,
  defaultTTL: 60_000, // 1 minute in milliseconds
});

export const serverCacheConfig = {
  lru: timeLru,
} as const;
