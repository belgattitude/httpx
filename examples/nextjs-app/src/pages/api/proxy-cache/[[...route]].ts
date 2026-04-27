import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { proxyCacheConfig } from '@/server/config/proxy-cache.config';
import { ProxyCache } from '@/server/lib/proxy-cache';

export const config = {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerTypeCompat = (req: any, res: any) => unknown;

export default serve(app) as unknown as HandlerTypeCompat;
