import { Decompressor } from "@httpx/compress";
import { Base64 } from "@httpx/encode";
import type { ITimeLruCache, SupportedCacheValues } from "@httpx/lru";
import type { Context } from "hono";
import type { UnofficialStatusCode } from "hono/utils/http-status";

import type { CacheKeyTuple } from "../cache-key";
import {
  CacheCompress,
  type CacheCompressOptions,
} from "../compress/cache-compress";
import type { CacheCompressAlgorithm } from "../compress/types";
import { JsonSerializer } from "../serializer/json-serializer";
import type { ICacheSerializer } from "../serializer/types";
import {
  XMemCache,
  type XMemCacheEntryInfo,
  type XMemCacheRunAsyncParams,
} from "../x-mem-cache";
import {
  acceptsEncoding,
  appendVary,
  buildCacheControl,
  createWeakEtag,
  type HonoXCacheControl,
  matchesIfNoneMatch,
} from "./http-utils";

/**
 * Origin added to the cache keys created by the hono helper, to separate
 * them from the ones created by XMemCache.runAsync for the same key.
 */
export const honoXCacheOrigin = "hono";

/**
 * Options shared by both createHonoXCache variants.
 */
type HonoXCacheBaseOptions = {
  /**
   * Serializer used to create the response body. The serialized string is
   * sent as-is, so the client must be able to parse it (see contentType).
   * Compressed entries are only sent as-is when they were created with a
   * serializer having the same identifier.
   * @default JsonSerializer
   */
  serializer?: ICacheSerializer;
  /**
   * Content-Type of the responses.
   * @default "application/json; charset=utf-8"
   */
  contentType?: string;
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
   * Add a "X-XCache: HIT|MISS|DEDUPED|BYPASS" response header (DEDUPED:
   * served by the in-flight execution of a concurrent request).
   * @default false
   */
  debugHeaders?: boolean;
};

/**
 * createHonoXCache options creating a dedicated XMemCache instance.
 */
export type HonoXCacheLruOptions = HonoXCacheBaseOptions & {
  /** The lru used to store the cache entries */
  lru: ITimeLruCache;
  /** Not available with lru, use HonoXCacheInstanceOptions */
  cache?: never;
  /**
   * Default namespace of the cache keys.
   * @default "default"
   */
  namespace?: string;
  /**
   * Compression options, or false to disable compression. Compressed
   * entries are stored as raw bytes, and sent as-is (Content-Encoding) to
   * clients accepting the algorithm.
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
   * Share the in-flight function execution between concurrent requests
   * having the same key (overridable per call with the `dedupe` param).
   * @default true
   */
  dedupe?: boolean;
};

/**
 * createHonoXCache options using an existing XMemCache instance (its lru,
 * namespace, compressor and enabled options are used).
 */
export type HonoXCacheInstanceOptions = HonoXCacheBaseOptions & {
  /** An existing XMemCache instance */
  cache: XMemCache;
  /** Not available, the lru of the instance is used */
  lru?: never;
  /** Not available, the namespace of the instance is used (or per call) */
  namespace?: never;
  /** Not available, the compressor of the instance is used */
  compression?: never;
  /** Not available, the enabled option of the instance is used (or per call) */
  enabled?: never;
  /** Not available, the instance option is used (or per call) */
  compressionEnabled?: never;
  /** Not available, the instance option is used (or per call) */
  dedupe?: never;
};

/**
 * createHonoXCache options: either an lru (a dedicated XMemCache is
 * created) or an existing XMemCache instance.
 */
export type HonoXCacheOptions =
  | HonoXCacheLruOptions
  | HonoXCacheInstanceOptions;

/**
 * Parameters of HonoXCache.json, same as XMemCache.runAsync.
 */
export type HonoXCacheRespondParams<
  TResult extends SupportedCacheValues,
  TKey extends CacheKeyTuple,
> = Omit<XMemCacheRunAsyncParams<TResult, TKey>, "origin"> & {
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
   * Info about an entry created by the hono helper (same as
   * XMemCache.getEntryInfo, with the hono origin).
   */
  getEntryInfo: <TKey extends CacheKeyTuple>(params: {
    /** Cache key, as provided to json() */
    key: TKey;
    /** Namespace, if overridden in json() */
    namespace?: string;
  }) => XMemCacheEntryInfo | undefined;
  /**
   * Return a cached response for the async function result.
   *
   * - Compressed entries are sent as-is when the client accepts the
   *   compression algorithm (Content-Encoding), otherwise decompressed.
   * - With etag enabled, returns 304 when If-None-Match matches.
   * - Pass `signal: c.req.raw.signal` to abort when the client disconnects
   *   (a 499 response is returned).
   * - Concurrent requests missing the cache for the same key share the
   *   same function execution (`dedupe` option or param).
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
 * Create the dedicated XMemCache instance of the helper, storing compressed
 * entries as raw bytes (binary encoding) so they can be sent as-is.
 */
const createXMemCache = (
  options: HonoXCacheLruOptions,
  serializer: ICacheSerializer
): XMemCache => {
  const {
    lru,
    namespace,
    compression = {},
    enabled = true,
    compressionEnabled = true,
    dedupe = true,
  } = options;
  return new XMemCache({
    lru,
    enabled,
    compressionEnabled,
    dedupe,
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
};

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
 * // or with an existing XMemCache instance
 * // const xcache = createHonoXCache({ cache: xMemCache });
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
    serializer = new JsonSerializer(),
    contentType = "application/json; charset=utf-8",
    etag = true,
    debugHeaders = false,
    cacheControl: defaultCacheControl = false,
  } = options;
  const serializerId = serializer.getIdentifier();

  const cache = options.cache ?? createXMemCache(options, serializer);

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
    let result: Awaited<ReturnType<typeof cache.runAsyncEntry>>;
    try {
      result = await cache.runAsyncEntry({
        ...runParams,
        origin: honoXCacheOrigin,
      });
    } catch (error) {
      // aborted because the client disconnected: nobody reads the response
      if (
        c.req.raw.signal.aborted &&
        error === runParams.signal?.reason &&
        error !== undefined
      ) {
        return c.body(null, 499 as UnofficialStatusCode);
      }
      throw error;
    }
    const { entry, cached, bypassed, deduped, generatedKey, expiresIn } =
      result;

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
    if (cache.compressionEnabled || entry.format === "compressed") {
      appendVary(headers, "Accept-Encoding");
    }
    if (debugHeaders) {
      let status = cached ? "HIT" : "MISS";
      if (deduped) {
        status = "DEDUPED";
      }
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

    // compressed with the same serializer: the bytes are the response body
    if (
      entry.format === "compressed" &&
      entry.meta.serializer === serializerId
    ) {
      const { algorithm } = entry.meta;
      const bytes = (
        typeof entry.data === "string"
          ? Base64.toUint8Array(entry.data)
          : entry.data
      ) as Uint8Array<ArrayBuffer>;
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
    // native entries, or compressed with another serializer
    const data = await cache.readEntry(entry);
    return c.body(serializer.serialize(data), 200, headers);
  };

  const getEntryInfo: HonoXCache["getEntryInfo"] = (params) =>
    cache.getEntryInfo({ ...params, origin: honoXCacheOrigin });

  return { cache, json, getEntryInfo };
};
