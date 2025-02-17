import { TimeLruCache } from '@httpx/lru';

import type {
  ProxyCacheConfig,
  ProxyCacheItem,
} from '@/server/lib/proxy-cache';

export const proxyCacheConfig: ProxyCacheConfig = {
  compressionAlgo: 'gzip',
  proxy: {
    basePath: '/api/proxy-cache',
    targetBaseUrl: 'http://localhost:3000',
  },
  cache: new TimeLruCache<ProxyCacheItem>({
    maxSize: 100,
    defaultTTL: 180_000,
  }),
};
