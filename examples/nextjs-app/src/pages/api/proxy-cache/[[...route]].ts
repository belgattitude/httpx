import { handle } from '@hono/node-server/vercel';
import { Hono } from 'hono';
import type { PageConfig } from 'next';

import { proxyCacheConfig } from '@/server/config/proxy-cache.config';
import { ProxyCache } from '@/server/lib/proxy-cache';

export const config: PageConfig = {
  runtime: 'nodejs',
  api: {
    bodyParser: false,
  },
};

const proxyCache = new ProxyCache(proxyCacheConfig);
const proxyCacheBasePath = proxyCacheConfig.proxy.basePath;

const app = new Hono().basePath(proxyCacheBasePath);

app.all('*', async (c) => {
  return proxyCache.getResponse(c);
});

export default handle(app);
