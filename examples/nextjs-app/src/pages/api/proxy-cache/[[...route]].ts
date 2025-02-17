import { handle } from '@hono/node-server/vercel';
import { Hono } from 'hono';
import type { PageConfig } from 'next';

import { proxyCacheConfig } from '@/server/config/proxy-cache.config';
import { ProxyCache, type ProxyCacheItem } from '@/server/lib/proxy-cache';

export const config: PageConfig = {
  runtime: 'nodejs',
  api: {
    bodyParser: false,
  },
};

const proxyCache = new ProxyCache(proxyCacheConfig);
const proxyCacheBasePath = proxyCacheConfig.proxy.basePath;

const app = new Hono().basePath(proxyCacheBasePath);

type CacheKeyParams = ProxyCacheItem['requestParams'] & {
  session: {
    userId: string | null;
  } | null;
};

app.all('*', async (c) => {
  return proxyCache.getResponse(c);
});

export type HonoProxyCacheRouter = typeof app;
export default handle(app);
