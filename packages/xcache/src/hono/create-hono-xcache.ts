import { Decompressor } from "@httpx/compress";
import type { ITimeLruCache, SupportedCacheValues } from "@httpx/lru";
import type { Context } from "hono";

import type { CacheKeyTuple } from "../cache-key";
import {
  CacheCompress,
  type CacheCompressOptions,
} from "../compress/cache-compress";
import type { CacheCompressAlgorithm } from "../compress/types";
import { JsonSerializer } from "../serializer/json-serializer";
import type { ICacheSerializer } from "../serializer/types";
import { XMemCache, type XMemCacheRunAsyncParams } from "../x-mem-cache";
import {
  acceptsEncoding,
  buildCacheControl,
  createWeakEtag,
  type HonoXCacheControl,
  matchesIfNoneMatch,
} from "./http-utils";

/**
 * createHonoXCache options.
 */
export type HonoXCacheOptions = {
  /** The lru used to store the cache entries */
  lru: ITimeLruCache;
  /**
   * Default namespace of the cache keys.
   * @default "default"
   */
  namespace?: string;
  /**
   * Serializer used to create the response body. The serialized string is
   * sent as-is, so the client must be able to parse it (see contentType).
   * @default JsonSerializer
   */
  serializer?: ICacheSerializer;
  /**
   * Content-Type of the responses.
   * @default "application/json; charset=utf-8"
   */
  contentType?: string;
  /**
   * Compression options, or false to disable compression. Compressed
   * entries are sent as-is (Content-Encoding) to clients accepting the
   * algorithm, without decompression nor serialization.
   * @default { algorithm: "gzip" }
   */
  compression?:
    | false
    | (Pick<
        CacheCompressOptions,
        "minimumRatio" | "minimumStringLength" | "minimumByteSaving"
      > & {
        /** @default "gzip" */
        algorithm?: CacheCompressAlgorithm;
      });
  /**
   * Enable or disable the cache globally (overridable per call with the
   * `enabled` param). When disabled, the function is always executed.
   * @default true
   */
  enabled?: boolean;
  /**
   * Enable or disable compression globally (overridable per call with the
   * `compressionEnabled` param), ie: `process.env.NODE_ENV === 'production'`.
   * Unlike `compression: false`, cache keys are kept the same.
   * @default true
   */
  compressionEnabled?: boolean;
  /**
   * Send a weak ETag and answer 304 Not Modified when the request
   * If-None-Match header matches.
   * @default true
   */
  etag?: boolean;
  /**
   * Cache-Control header sent with cached responses (overridable per call).
   * By default none is sent: the data is only cached on the server.
   *
   * @example
   * ```typescript
   * cacheControl: "public, max-age=60"
   * // or, max-age = remaining ttl of the server cache entry
   * cacheControl: { maxAge: "ttl", scope: "private", staleWhileRevalidate: 30 }
   * ```
   * @default false
   */
  cacheControl?: HonoXCacheControl;
  /**
   * Add a "X-XCache: HIT|MISS|BYPASS" response header.
   * @default false
   */
  debugHeaders?: boolean;
};

/**
 * Parameters of HonoXCache.json, same as XMemCache.runAsync.
 */
export type HonoXCacheRespondParams<
  TResult extends SupportedCacheValues,
  TKey extends CacheKeyTuple,
> = XMemCacheRunAsyncParams<TResult, TKey> & {
  /**
   * Additional response headers. A Cache-Control header provided here takes
   * precedence over the cacheControl option.
   */
  headers?: Record<string, string>;
  /** Cache-Control for this call, overrides the global cacheControl option */
  cacheControl?: HonoXCacheControl;
};

/**
 * Hono helper returned by createHonoXCache.
 */
export type HonoXCache = {
  /** The underlying XMemCache instance */
  cache: XMemCache;
  /**
   * Return a cached response for the async function result.
   *
   * - Compressed entries are sent as-is when the client accepts the
   *   compression algorithm (Content-Encoding), otherwise decompressed.
   * - With etag enabled, returns 304 when If-None-Match matches.
   * - The cache and compression can be disabled per call with the
   *   `enabled` and `compressionEnabled` params.
   * - No Cache-Control header by default (see the cacheControl option).
   */
  json: <TResult extends SupportedCacheValues, TKey extends CacheKeyTuple>(
    c: Context,
    params: HonoXCacheRespondParams<TResult, TKey>
  ) => Promise<Response>;
};

const textDecoder = new TextDecoder();

/**
 * Create a cache helper for hono route handlers.
 *
 * @example
 * ```typescript
 * import { Hono } from 'hono';
 * import { TimeLruCache } from '@httpx/xcache';
 * import { createHonoXCache } from '@httpx/xcache/hono';
 *
 * const xcache = createHonoXCache({
 *   lru: new TimeLruCache({ maxSize: 500, defaultTTL: 60_000 }),
 * });
 *
 * const app = new Hono();
 *
 * app.get('/api/products/:id', (c) =>
 *   xcache.json(c, {
 *     key: ['/api/products', { id: c.req.param('id') }],
 *     fn: () => fetchProduct(c.req.param('id')),
 *   })
 * );
 * ```
 */
export const createHonoXCache = (options: HonoXCacheOptions): HonoXCache => {
  const {
    lru,
    namespace,
    serializer = new JsonSerializer(),
    contentType = "application/json; charset=utf-8",
    compression = {},
    etag = true,
    debugHeaders = false,
    enabled = true,
    compressionEnabled = true,
    cacheControl: defaultCacheControl = false,
  } = options;

  const cache = new XMemCache({
    lru,
    enabled,
    compressionEnabled,
    ...(namespace === undefined ? {} : { namespace }),
    ...(compression === false
      ? {}
      : {
          compressor: new CacheCompress({
            ...compression,
            algorithm: compression.algorithm ?? "gzip",
            serializer,
            // raw bytes can be sent as-is
            encoding: "binary",
          }),
        }),
  });

  const decompressors = new Map<CacheCompressAlgorithm, Decompressor>();
  const getDecompressor = (algorithm: CacheCompressAlgorithm): Decompressor => {
    let decompressor = decompressors.get(algorithm);
    if (decompressor === undefined) {
      decompressor = new Decompressor(algorithm);
      decompressors.set(algorithm, decompressor);
    }
    return decompressor;
  };

  const json: HonoXCache["json"] = async (c, params) => {
    const {
      headers: extraHeaders,
      cacheControl = defaultCacheControl,
      ...runParams
    } = params;
    const { entry, cached, bypassed, generatedKey, expiresIn } =
      await cache.runAsyncEntry(runParams);

    const headers: Record<string, string> = { ...extraHeaders };
    const hasCacheControlHeader = Object.keys(headers).some(
      (name) => name.toLowerCase() === "cache-control"
    );
    // no Cache-Control when the cache is bypassed, unless provided in headers
    if (!bypassed && !hasCacheControlHeader) {
      const value = buildCacheControl(cacheControl, expiresIn);
      if (value !== undefined) {
        headers["Cache-Control"] = value;
      }
    }
    if (compression !== false) {
      headers.Vary = "Accept-Encoding";
    }
    if (debugHeaders) {
      let status = cached ? "HIT" : "MISS";
      if (bypassed) {
        status = "BYPASS";
      }
      headers["X-XCache"] = status;
    }
    // no etag when the cache is bypassed (would change on every request)
    if (etag && !bypassed) {
      const tag = createWeakEtag(generatedKey, entry.createdAt);
      headers.ETag = tag;
      if (matchesIfNoneMatch(c.req.header("If-None-Match"), tag)) {
        return c.body(null, 304, headers);
      }
    }
    headers["Content-Type"] = contentType;

    if (entry.format === "compressed") {
      const { algorithm } = entry.meta;
      const bytes = entry.data as Uint8Array<ArrayBuffer>;
      if (acceptsEncoding(c.req.header("Accept-Encoding"), algorithm)) {
        headers["Content-Encoding"] = algorithm;
        headers["Content-Length"] = String(bytes.byteLength);
        return c.body(bytes, 200, headers);
      }
      const body = textDecoder.decode(
        await getDecompressor(algorithm).fromUint8Array(bytes)
      );
      return c.body(body, 200, headers);
    }
    return c.body(serializer.serialize(entry.data), 200, headers);
  };

  return { cache, json };
};
