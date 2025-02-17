import { Compressor, Decompressor } from '@httpx/compress';
import type { ITimeLruCache } from '@httpx/lru';
import { createStableHashOrThrow } from '@httpx/stable-hash';
import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { proxy } from 'hono/proxy';

export type ProxyCacheConfig = {
  cache: ITimeLruCache<ProxyCacheItem>;
  compressionAlgo: 'gzip';
  proxy: {
    basePath: string;
    targetBaseUrl: string;
  };
};

export type ProxyCacheItem = {
  requestHeaders: Record<string, string>;
  requestParams: {
    body?: Record<string, string | File> | null;
    contentType: string | null;
    method: string;
    query?: Record<string, string[]> | null;
    url: string;
  };
  responseText: string;
};

type CacheKeyParams = ProxyCacheItem['requestParams'] & {
  session: {
    userId: string | null;
  } | null;
};

export class ProxyCache {
  #config: ProxyCacheConfig;
  #compressor: Compressor;
  #decompressor: Decompressor;
  constructor(config: ProxyCacheConfig) {
    this.#config = config;
    this.#compressor = new Compressor(config.compressionAlgo);
    this.#decompressor = new Decompressor(config.compressionAlgo);
  }

  getTargetUrl = (c: Context) => {
    const { basePath, targetBaseUrl } = this.#config.proxy;
    const path = c.req.path
      .replace(basePath, '')
      .split('/')
      .filter(Boolean)
      .join('/');
    return `${targetBaseUrl}/${path}`;
  };

  getResponse = async (c: Context): Promise<Response> => {
    const targetUrl = this.getTargetUrl(c);
    const contentType = c.req.header('Content-Type');

    const cacheKeyParams: CacheKeyParams = {
      url: targetUrl,
      method: c.req.method,
      query: c.req.queries(),
      body: await c.req.parseBody(),
      contentType: contentType ?? null,
      session: {
        userId: getCookie(c, 'muxData') ?? null,
      },
    };
    const key = await createStableHashOrThrow(cacheKeyParams);

    const { cache } = this.#config;
    if (cache.has(key)) {
      const data = cache.get(key)!;
      const text = await this.#decompressor.fromEncodedString(
        data.responseText
      );
      return c.body(text, {
        headers: {
          'X-Proxy-Cached': '1',
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
    }
    const res = await proxy(targetUrl, {
      method: c.req.method,
      headers: {
        ...c.req.header(),
        'X-Forwarded-For': targetUrl,
      },
    });
    const responseText = await res.clone().text();
    const data: ProxyCacheItem = {
      requestHeaders: Object.fromEntries(res.headers),
      requestParams: cacheKeyParams,
      responseText: await this.#compressor.toEncodedString(responseText),
    };
    cache.set(key, data);
    return res;
  };
}
