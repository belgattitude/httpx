# @httpx/xcache

[![npm](https://img.shields.io/npm/v/@httpx/xcache?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/xcache) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-xcache-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fxcache) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=22%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/xcache?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/xcache) [![license](https://img.shields.io/npm/l/@httpx/xcache?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

In-memory cache for async functions, with optional compression, statistics and a hono integration.

## Install

```bash
$ npm install @httpx/xcache
$ yarn add @httpx/xcache
$ pnpm add @httpx/xcache
```

## Features

- 🗝️&nbsp; Stable cache keys from any serializable params ([@httpx/stable-hash](https://github.com/belgattitude/httpx/tree/main/packages/stable-hash)).
- 🗜️&nbsp; Optional [compression](#with-compression) (gzip/deflate) with json, superjson or devalue serializers.
- 📊&nbsp; [Statistics](#statistics), [enable / disable](#enable--disable) globally or per call.
- 🐘&nbsp; [Deduplication](#deduplication) of concurrent calls (cache stampede protection).
- 🛑&nbsp; [Abort signal](#abort-signal) support (AbortController, timeouts, client disconnects).
- 🔥&nbsp; [Hono](#hono) helper: compressed responses sent as-is, ETag, Cache-Control.
- 📐&nbsp; Lightweight (starts at [~1.7kB](#bundle-size)).
- 🛡️&nbsp; Tested on [node 22-26, bun, browser and cloudflare workers](#compatibility).
- 🗝️&nbsp; Available in ESM.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/xcache) or [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/xcache#readme)

## Simple usage

```typescript
import { XMemCache, TimeLruCache } from "@httpx/xcache";

const xMemCache = new XMemCache({
  lru: new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 }),
  namespace: "default",
});

const fetchSmth = async (params: { id: number }) => {
  return { id: params.id, data: `Data for ${params.id}` };
};

const params = { id: 1 };

const { data } = await xMemCache.runAsync({
  key: ["/api/data", params],
  fn: () => fetchSmth(params),
});

// data: { id: 1, data: 'Data for 1' }
```

`runAsync` options and result:

```typescript
const { data, meta } = await xMemCache.runAsync({
  // Cache key: a non-empty string followed by any serializable values
  // (objects keys are sorted, so { a: 1, b: 2 } and { b: 2, a: 1 } give the same key)
  key: ["/api/data", params],
  // Executed on cache miss, errors are not cached
  fn: () => fetchSmth(params),
  // Optional: time to live in milliseconds (default: the lru defaultTTL)
  ttl: 30_000,
  // Optional: override the default namespace
  namespace: "other",
  // Optional: execute the function and refresh the entry even if cached
  forceRevalidate: false,
  // Optional: see "Enable / disable"
  enabled: true,
  compressionEnabled: true,
});

// meta.cached: true when served from the cache
// meta.generatedKey: '{"key":["/api/data",{"id":1}],"ns":"other"}'
```

Or with `createCacheFn` to get a bound `runAsync` function:

```typescript
import { createCacheFn, TimeLruCache } from "@httpx/xcache";

const cacheFn = createCacheFn({
  lru: new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 }),
});

const { data } = await cacheFn({
  key: ["/api/data", params],
  fn: () => fetchSmth(params),
});
```

## With compression

You can use compression to reduce the size of the cached data. The library supports `gzip` and `deflate` compression algorithms. To be able to serialize and deserialize the data, you can use adapters like `DevalueSerializer`, `SuperjsonSerializer` or `JsonSerializer`.

> [!NOTE]
> A serializer is only needed with compression. Without a compressor, `XMemCache` keeps the values as-is in the LRU (no serialization cost, all types supported, same instance returned on each hit). See [choosing a serializer](#choosing-a-serializer) for the memory gains.

```typescript
import {
  XMemCache,
  TimeLruCache,
  CacheCompress,
  SuperjsonSerializer,
} from "@httpx/xcache";

const xMemCache = new XMemCache({
  lru: new TimeLruCache({ maxSize: 50, defaultTTL: 120_000 }),

  compressor: new CacheCompress({
    // To enable compression the data needs to be serialized
    // Choose between SuperjsonSerializer, DevalueSerializer, JsonSerializer
    // (see "Choosing a serializer")
    serializer: new SuperjsonSerializer(),
    algorithm: "gzip", // or 'deflate'

    // Skip compression if the achieved compression ratio is less than
    // the provided ratio. 1.3 means that the compression will be skipped
    // if the ratio does not give at least 30% memory reduction
    // @default 1.3
    minimumRatio: 1.3,

    // Skip compression if the data (or its serialized form) is shorter
    // than 16K characters: small payloads are never compressed
    // @default 16_384
    minimumStringLength: 16_384,

    // Skip compression if the achieved byte saving is less than 32 KB
    // @default 32_768
    minimumByteSaving: 32_768,

    // Compressed bytes are kept as Uint8Array ("binary"), use "base64"
    // or "base64_urlsafe" if a string is required (~33% larger)
    // @default "binary"
    encoding: "binary",
  }),
});

const fetchThings = async (params: { name: string }) => {
  return {
    message: `Hello ${params.name}`,
    bigint: BigInt("1234567890123456789012345678901234567890"),
    date: new Date(),
  };
};

// Params are converted into a stable key (@httpx/stable-hash)
const params = { name: "cool", createdAt: new Date() };

const { data } = await xMemCache.runAsync({
  key: ["/api/data", params],
  fn: () => fetchThings(params),
});
```

### Compression meta

Compressed entries keep a meta describing how they were stored. It's returned by `runAsync` in `meta.compression` (when the data was stored compressed):

```typescript
const { data, meta } = await xMemCache.runAsync({
  key: ["/api/data", params],
  fn: () => fetchThings(params),
});

// meta.compression
// {
//   algorithm: "gzip",        // "gzip" | "deflate"
//   encoding: "binary",       // "binary" | "base64" | "base64_urlsafe"
//   serializer: "superjson",  // serializer identifier
//   originalSize: 974025,     // serialized string length
//   compressedSize: 90333,    // compressed length
//   ratio: 10.78,
// }
```

On a cache hit, the meta is checked against the current compressor options. An existing entry created with a different algorithm, encoding or serializer (ie: a shared lru or changed options) is never decoded with the wrong settings, it's treated as a cache miss: the function is executed again and the entry is replaced.

## Enable / disable

The cache and the compression can be enabled or disabled globally, and overridden per call.

| Option | Default | When disabled |
| --- | --- | --- |
| `enabled` | `true` | The function is always executed, the cache is neither read nor written (`meta.bypassed: true`). |
| `compressionEnabled` | `true` | Entries are stored as-is (no serialization cost). Cache keys are unchanged and compressed entries still read. |

```typescript
const xMemCache = new XMemCache({
  lru: new TimeLruCache({ maxSize: 50, defaultTTL: 120_000 }),
  compressor: new CacheCompress({
    algorithm: "gzip",
    serializer: new SuperjsonSerializer(),
  }),
  // 👇 Global: ie: disable the cache with an env variable
  enabled: process.env.XCACHE_ENABLED !== "false",
  // 👇 Global: ie: no compression in development
  compressionEnabled: process.env.NODE_ENV === "production",
});

const isPreview = true;

const { data, meta } = await xMemCache.runAsync({
  key: ["/api/data", params],
  fn: () => fetchThings(params),
  // 👇 Per call: overrides the global options
  enabled: !isPreview,
  compressionEnabled: false,
});

// meta.bypassed === true when the cache was disabled for this call
xMemCache.enabled; // global state (readonly)
xMemCache.compressionEnabled; // false when disabled or without compressor
```

> [!TIP]
> Disabling the cache for a call doesn't remove an existing entry, use `forceRevalidate: true` to refresh it. Entries stored while compression is disabled are reported with `skippedReason: "compression_disabled"` in the [statistics](#statistics).

## Deduplication

On a cache miss, concurrent calls having the same key share the in-flight function execution: the function runs once, and all the callers get its result (or its error). This protects the data source when many requests miss the cache at the same time (ie: after expiration).

```typescript
const xMemCache = new XMemCache({
  lru: new TimeLruCache({ maxSize: 50, defaultTTL: 120_000 }),
  // 👇 Global, enabled by default
  dedupe: true,
});

const [a, b] = await Promise.all([
  xMemCache.runAsync({
    key: ["/api/data", params],
    fn: () => fetchThings(params),
  }),
  xMemCache.runAsync({
    key: ["/api/data", params],
    fn: () => fetchThings(params),
  }),
]);
// 👆 fetchThings is called once
// a.meta: { cached: false }
// b.meta: { cached: false, deduped: true }

// 👇 Per call: overrides the global option
await xMemCache.runAsync({ key: ["/api/data"], fn, dedupe: false });
```

- Errors are not cached: all the waiting callers get the same error, and the next call executes the function again.
- Calls with `forceRevalidate: true` never wait for an in-flight execution (it may have started before the data changed), but the following calls wait for theirs.
- Bypassed calls (`enabled: false`) are never deduplicated.
- The first caller's `ttl` (and `fn`) is used, and all the callers get the same data reference (as with cache hits).
- Deduplication is done per `XMemCache` instance, not per lru.

## Abort signal

Pass a `signal` to abort a call (ie: `AbortController`, `AbortSignal.timeout()`). The function receives it to cancel its own work (ie: `fetch`).

```typescript
const { data } = await xMemCache.runAsync({
  key: ["/api/products", { id }],
  fn: ({ signal }) =>
    fetch(`/api/products/${id}`, { signal }).then((r) => r.json()),
  // 👇 ie: abort after 5 seconds
  signal: AbortSignal.timeout(5_000),
});
```

- The call rejects with the signal reason (ie: `AbortError`, `TimeoutError`) as soon as it's aborted, even if the function ignores the signal. An already aborted signal rejects immediately, cache hits included.
- The result of an aborted execution is never stored (ie: a function returning a fallback value when aborted).
- With [deduplication](#deduplication), the execution is shared: aborting a call only rejects that call, and the function's signal is aborted when **all** the waiting calls are aborted (an aborted execution is never joined). Calls without a signal keep the execution alive.
- The function receives no signal when the call has none.

## Statistics

`getStats()` returns statistics about the cached entries, and `getEntryInfo()` the info of a single entry. Expired entries are ignored and the lru order is not affected.

```typescript
const stats = xMemCache.getStats();
// {
//   items: 3,                // non-expired entries
//   nativeItems: 1,          // stored as-is (no compressor or compression skipped)
//   compressedItems: 2,
//   compressedSize: 180666,  // total size of the compressed entries
//   originalSize: 1948050,   // same entries, serialized size before compression
//   entries: [               // least recently used first
//     {
//       key: '{"compressorId":"cache-compress:superjson","key":["/api/data",{"name":"cool"}],"ns":"default"}',
//       format: "compressed",
//       size: 90333,
//       compression: { algorithm: "gzip", encoding: "binary", serializer: "superjson", originalSize: 974025, compressedSize: 90333, ratio: 10.78 },
//       createdAt: 1792411200000,
//       expiresIn: 118500,   // remaining ttl in milliseconds
//     },
//     {
//       key: '{"compressorId":"cache-compress:superjson","key":["/api/small"],"ns":"default"}',
//       format: "native",
//       skippedReason: "minimum_byte_saving_not_met",
//       createdAt: 1792411123000,
//       expiresIn: 42000,
//     },
//     // ...
//   ],
// }

const info = xMemCache.getEntryInfo({ key: ["/api/data", params] });
// same shape as an entry above, or undefined when not cached
```

> [!NOTE]
> Native (uncompressed) entries are live objects, their size can't be measured and is not included in the totals. If the lru is shared, entries of other `XMemCache` instances are included.

### Sharing the lru

Every value stored by `XMemCache` is branded, so the lru can safely be shared with other code: values not created by `XMemCache` (even if they look alike) are ignored by `getStats()` / `getEntryInfo()` and treated as a cache miss by `runAsync()`. The `isXMemCacheEntry` typeguard is exported:

```typescript
import { isXMemCacheEntry } from "@httpx/xcache";

for (const [key, value] of lru) {
  if (isXMemCacheEntry(value)) {
    console.log(key, value.format); // "native" | "compressed"
  }
}
```

## Hono

`@httpx/xcache/hono` provides a helper to cache [hono](https://hono.dev) route responses (`hono` is an optional peer dependency).

```typescript
import { TimeLruCache } from "@httpx/xcache";
import { createHonoXCache } from "@httpx/xcache/hono";
import { Hono } from "hono";

// One instance per app (JsonSerializer + gzip by default)
const xcache = createHonoXCache({
  lru: new TimeLruCache({ maxSize: 500, defaultTTL: 60_000 }),
});

const app = new Hono();

app.get("/api/products/:id", (c) =>
  xcache.json(c, {
    key: ["/api/products", { id: c.req.param("id") }],
    fn: () => fetchProduct(c.req.param("id")),
    ttl: 30_000, // optional
  })
);
```

- **Compressed entries are sent as-is**: when the client accepts the compression algorithm (`Accept-Encoding`), the stored gzip/deflate bytes are sent with `Content-Encoding`, without decompression nor serialization. Otherwise they are decompressed (but not deserialized).
- **ETag**: a weak `ETag` is sent, and `304 Not Modified` is returned when `If-None-Match` matches. It changes every time the entry is refreshed.
- **Deduplication**: concurrent requests missing the cache for the same key share one function execution (see [deduplication](#deduplication)).
- **Enable / disable**: `enabled` and `compressionEnabled` work as for `XMemCache`, globally or per call (ie: `xcache.json(c, { key, fn, enabled: c.req.query("nocache") === undefined })`). When the cache is bypassed, no `ETag` is sent. Prefer `compressionEnabled: false` over `compression: false` to toggle compression, as it keeps the same cache keys.
- **Cache-Control**: none by default, the data is only cached on the server (see [Cache-Control](#cache-control)).
- **Errors are not cached**: see [error handling](#error-handling).
- **Abort**: see [client disconnects and timeouts](#client-disconnects-and-timeouts).
- `Vary: Accept-Encoding` is sent when compression is enabled. Hono's `compress()` middleware skips responses already having a `Content-Encoding`.

Options:

```typescript
createHonoXCache({
  // A dedicated XMemCache is created with this lru (or use an existing
  // instance, see "With an existing XMemCache instance")
  lru,
  namespace: "default",
  // The serialized string is the response body
  serializer: new JsonSerializer(),
  contentType: "application/json; charset=utf-8",
  // or false to disable compression
  compression: {
    algorithm: "gzip", // or "deflate"
    minimumRatio: 1.3,
    minimumStringLength: 16_384,
    minimumByteSaving: 32_768,
  },
  etag: true,
  cacheControl: false, // see "Cache-Control"
  debugHeaders: false, // "X-XCache: HIT|MISS|DEDUPED|BYPASS" header
  // Global enable / disable (see "Enable / disable")
  enabled: true,
  // Share the in-flight execution of concurrent requests (see "Deduplication")
  dedupe: true,
  compressionEnabled: process.env.NODE_ENV === "production",
});
```

> [!NOTE]
> The response body is the serialized string. With `SuperjsonSerializer` or `DevalueSerializer`, set a matching `contentType` (ie: `application/superjson+json`), the client will need to deserialize it.

### With an existing XMemCache instance

Instead of an `lru`, an existing `XMemCache` instance can be provided. Its lru, namespace, compressor and enabled options are used:

```typescript
const xMemCache = new XMemCache({
  lru: new TimeLruCache({ maxSize: 500, defaultTTL: 60_000 }),
  compressor: new CacheCompress({
    algorithm: "gzip",
    serializer: new JsonSerializer(),
  }),
});

const xcache = createHonoXCache({ cache: xMemCache });
```

| Entry stored by the instance | Response |
| --- | --- |
| compressed, same serializer as the helper (`json`) | sent as-is with `Content-Encoding` (base64 entries are decoded first) |
| compressed with another serializer (ie: `superjson`) | decompressed, deserialized and re-serialized with the helper serializer |
| native | serialized with the helper serializer |

> [!TIP]
> To benefit from sending compressed bytes as-is, use the same serializer in the instance compressor and in the helper (`JsonSerializer` by default), and `encoding: "binary"` (default). The `lru`, `namespace`, `compression`, `enabled` and `compressionEnabled` options can't be used with `cache` (the instance ones are used, `namespace`, `enabled` and `compressionEnabled` can still be set per call).

#### Cache keys origin

Keys created by the hono helper include an `"origin":"hono"` part, so a route and a service calling `xMemCache.runAsync()` with the same key on the same instance don't share (or overwrite) entries, as the cached data and the route response may differ:

```typescript
// '{"compressorId":"cache-compress:json","key":["/api/products",{"id":"1"}],"ns":"default"}'
await xMemCache.runAsync({ key: ["/api/products", { id: "1" }], fn });

// '{"compressorId":"cache-compress:json","key":["/api/products",{"id":"1"}],"ns":"default","origin":"hono"}'
await xcache.json(c, { key: ["/api/products", { id: "1" }], fn });

xcache.getEntryInfo({ key: ["/api/products", { id: "1" }] }); // hono entry info
```

The `origin` param is also available on `runAsync()`, `runAsyncEntry()` and `getEntryInfo()` for other integrations.

### Cache-Control

By default no `Cache-Control` header is sent: a server memory cache shouldn't make browsers or CDNs cache data that might be private. Use the `cacheControl` option, globally or per call:

```typescript
const xcache = createHonoXCache({
  lru,
  // 👇 max-age = remaining ttl of the server cache entry, so clients
  //    never keep the response longer than the server does
  cacheControl: { maxAge: "ttl", scope: "private", staleWhileRevalidate: 30 },
  // → "Cache-Control: private, max-age=<remaining ttl>, stale-while-revalidate=30"
});

app.get("/api/products/:id", (c) =>
  xcache.json(c, {
    key: ["/api/products", { id: c.req.param("id") }],
    fn: () => fetchProduct(c.req.param("id")),
    // 👇 Per call override: false, a string or options
    cacheControl: "public, max-age=60",
  })
);
```

| `cacheControl` | Cache-Control header |
| --- | --- |
| `false` (default) | none |
| `"public, max-age=60"` | sent as-is |
| `{ maxAge: 60 }` | `private, max-age=60` |
| `{ maxAge: "ttl", scope: "public" }` | `public, max-age=<remaining server ttl in seconds>` |
| `{ maxAge: "ttl", staleWhileRevalidate: 30 }` | `private, max-age=<remaining ttl>, stale-while-revalidate=30` |

- `scope` defaults to `private`, shared caches (CDN) only cache when explicitly `public`.
- A `Cache-Control` provided in `headers` always takes precedence.
- Nothing is sent when the cache is bypassed (`enabled: false`). `304` responses keep the header.

### Client disconnects and timeouts

Pass the request signal to abort the function when the client disconnects. A `499` response (nobody reads it) is returned instead of throwing. Combine it with a timeout with `AbortSignal.any()`, a timeout error is propagated as usual (see [error handling](#error-handling)).

```typescript
app.get("/api/products/:id", (c) =>
  xcache.json(c, {
    key: ["/api/products", { id: c.req.param("id") }],
    fn: ({ signal }) => fetchProduct(c.req.param("id"), { signal }),
    signal: c.req.raw.signal,
    // or with a timeout
    // signal: AbortSignal.any([c.req.raw.signal, AbortSignal.timeout(5_000)]),
  })
);
```

> [!TIP]
> Not aborting is a valid choice: an expensive execution completed after the client has left still populates the cache for the next requests. With deduplication, a disconnecting client only aborts the execution when all the other waiting clients are gone too.

### Error handling

When `fn` throws, nothing is cached and the error is propagated: the next request will retry, and an existing entry is kept if a revalidation (`forceRevalidate`) fails. Handle errors as usual with hono, ie: with [@httpx/exception](https://github.com/belgattitude/httpx/tree/main/packages/exception):

```typescript
import { HttpNotFound, isHttpException } from "@httpx/exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const fetchProduct = async (id: string) => {
  const product = await db.products.find(id);
  if (product === undefined) {
    // 👇 Not cached, retried on the next request
    throw new HttpNotFound(`Product ${id} not found`);
  }
  return product;
};

app.get("/api/products/:id", (c) =>
  xcache.json(c, {
    key: ["/api/products", { id: c.req.param("id") }],
    fn: () => fetchProduct(c.req.param("id")),
  })
);

app.onError((err, c) => {
  if (isHttpException(err)) {
    return c.json(
      { error: err.message },
      err.statusCode as ContentfulStatusCode
    );
  }
  return c.json({ error: "Internal Server Error" }, 500);
});
```

> [!TIP]
> To cache "not found" results too (ie: to protect the database), return a value instead of throwing and build the response with the underlying cache:
>
> ```typescript
> app.get("/api/products/:id", async (c) => {
>   const id = c.req.param("id");
>   const { data } = await xcache.cache.runAsync({
>     key: ["/api/products", { id }],
>     fn: async () => (await db.products.find(id)) ?? null,
>   });
>   return data === null ? c.json({ error: "Not found" }, 404) : c.json(data);
> });
> ```

To use compressed entries in other contexts, `XMemCache.runAsyncEntry()` returns the stored entry as-is (`{ entry, cached, bypassed, generatedKey, expiresIn }`), with `entry.format` being `"compressed"` (`entry.data` is the compressed `Uint8Array`, `entry.meta` the compression meta) or `"native"`. Use `xMemCache.readEntry(entry)` to get the decompressed data.

## Choosing a serializer

A serializer is only used when compression is enabled. Without a compressor, values are stored as live objects in memory, so no serializer is involved.

### Memory gains

Estimated memory used by one cached entry (~11k rows, Node 26.12.0, V8 heap for live objects, gzip with `encoding: "binary"`):

| Data | No compression (live objects) | json | superjson | superjson+dedupe | devalue |
| --- | --: | --: | --: | --: | --: |
| Native types | 2.01 MB | 🥇 90 kB (-96%) | 🥇 90 kB (-96%) | 🥇 90 kB (-96%) | 214 kB (-89%) |
| Extended types (Date, BigInt...) | 3.95 MB | n/a | 322 kB (-92%) | 🥇 286 kB (-93%) | 359 kB (-91%) |
| Repeated objects (10 shared refs) | 973 kB | 65 kB (-93%) ¹ | 121 kB (-88%) | 🥇 83 kB (-91%) | 136 kB (-86%) |

¹ json does not preserve shared references: each row gets its own copy once deserialized. superjson, superjson+dedupe and devalue restore them.

Compression trades CPU for memory: each cache hit pays gunzip + deserialize (see below) and returns a new copy of the data. With `encoding: "base64"`, add ~33% to the compressed sizes.

### Performance and size

Measured on Node 26.12.0 with ~11k rows (see [benchmarks](#benchmarks)), gzip sizes with `encoding: "binary"`. Bun 1.4.3 shows the same ranking, with faster json and devalue.

|  | json | superjson | superjson+dedupe | devalue |
| --- | --- | --- | --- | --- |
| **Recommended for** | JSON-safe data (default choice) | Extended types, read-heavy caches | Extended types with repeated objects, using compression | Extended types, write-heavy caches |
| Extended types (Date, BigInt, Map...) | ❌ | ✅ | ✅ | ✅ |
| Preserves shared references | ❌ (duplicated) | ✅ (duplicated in output) | ✅ | ✅ |
| _Native types (974 kB json)_ |  |  |  |  |
| Serialize | 🥇 1.6 ms | 12.3 ms (~8x slower) | 12.2 ms (~8x slower) | 9.0 ms (~6x slower) |
| Deserialize | 🥇 1.2 ms | 🥇 1.1 ms | 🥇 1.1 ms | 3.0 ms |
| Size raw / gzip | 🥇 974 kB / 90 kB | 🥇 974 kB / 90 kB | 🥇 974 kB / 90 kB | 1.19 MB / 214 kB (~2.4x larger) |
| _Extended types_ |  |  |  |  |
| Serialize | n/a | 78 ms | 67 ms | 🥇 21 ms |
| Deserialize | n/a | 32 ms | 24 ms | 🥇 9 ms |
| Size raw / gzip | n/a | 3.62 MB / 322 kB | 3.24 MB / 🥇 286 kB | 🥇 2.47 MB / 359 kB |
| _Repeated objects (10 shared refs)_ |  |  |  |  |
| Serialize | 8.1 ms | 29.8 ms | 14.8 ms | 🥇 7.0 ms |
| Deserialize | 3.6 ms | 14.0 ms | 3.1 ms | 🥇 2.3 ms |
| Size raw / gzip | 2.15 MB / 🥇 65 kB | 2.82 MB / 121 kB | 754 kB / 83 kB | 🥇 688 kB / 136 kB |
| **Advantages** | Fastest, smallest, no dependency | Fast deserialize, compresses well | Best gzip size for extended types, fast deserialize | Fastest with extended types, smallest raw |
| **Drawbacks** | No extended types, shared references are lost | Slowest serialize, large raw output with shared references | Slow serialize | Compresses poorly (~2.4x larger gzip) |

> [!TIP]
> Dedupe is a superjson option, use a custom serializer to enable it:
>
> ```typescript
> import type { ICacheSerializer } from "@httpx/xcache";
> import { SuperJSON } from "superjson";
>
> const superjson = new SuperJSON({ dedupe: true });
>
> const superjsonDedupeSerializer: ICacheSerializer = {
>   getIdentifier: () => "superjson-dedupe",
>   serialize: (data) => superjson.stringify(data),
>   deserialize: (serialized) => superjson.parse(serialized),
>   toString: () => "superjson-dedupe",
> };
> ```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

### Node 26.12.0

```
 RUN  v5.0.5 /home/user/github/httpx/packages/xcache

 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 13422ms
   name                                       hz     min      max    mean     p75      p99     p995     p999     rme  samples
   with cache (just lru)           14,185,532.56  0.0000  10.0160  0.0001  0.0001   0.0002   0.0002   0.0005  ±2.56%  9524367   fastest
   with cache                       4,220,301.78  0.0001   0.3229  0.0002  0.0003   0.0004   0.0005   0.0008  ±0.41%  3209694
   cache with superjson + deflate         460.58  1.8447   7.8180  2.2736  2.2129   5.7580   7.4834   7.7595  ±3.35%      352
   cache with json + deflate              435.87  1.8042  17.2473  2.4395  2.4116   6.4092  10.5981  16.2490  ±5.40%      328
   cache with devalue + deflate           217.91  4.1015  12.8965  4.7364  4.5897  11.7926  12.0766  12.7325  ±3.79%      169
   original function                      2.4931  400.70   401.30  401.11  401.19   401.29   401.29   401.30  ±0.03%       10   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > serialize native types 3195ms
   name                                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   json.serialize(974 kB) - native types        714.20   1.3010   1.8647   1.4044   1.4465   1.6874   1.7330   1.8393  ±0.47%      570   fastest
   devalue.serialize(1.19 MB) - native types    103.70   7.8809  14.9558   9.8089  10.6467  14.3172  14.6365  14.8920  ±3.05%       82
   superjson.serialize(974 kB) - native types  85.4016  10.7994  19.5093  11.7781  12.0728  15.4690  17.4891  19.1053  ±2.23%       68   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > deserialize native types 3173ms
   name                                              hz     min     max    mean     p75     p99    p995    p999     rme  samples
   json.deserialize(974 kB) - native types       865.66  1.0493  1.7272  1.1625  1.1802  1.6174  1.6465  1.7214  ±0.66%      689   fastest
   superjson.deserialize(974 kB) - native types  863.39  1.0397  1.7089  1.1652  1.1762  1.5487  1.6154  1.6812  ±0.63%      687
   devalue.deserialize(1.19 MB) - native types   333.51  2.7449  8.0040  3.0252  3.0225  3.7715  4.0940  7.0061  ±1.52%      267   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > serialize extended types 2331ms
   name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.serialize(2.47 MB) - extended types    46.4878  19.0080  31.9587  21.7131  22.3943  29.8152  30.8869  31.7443  ±3.55%       38   fastest
   superjson.serialize(3.62 MB) - extended types  11.8665  75.9182   104.58  85.0763  86.3669   103.87   104.23   104.51  ±7.70%       10
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > deserialize extended types 2197ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types     118.93   6.7972  14.2278   8.6415  10.0065  11.4253  12.8266  13.9476  ±3.54%       93   fastest
   superjson.deserialize(3.62 MB) - extended types  29.6767  30.6183  40.6525  33.8839  34.6322  40.5668  40.6096  40.6440  ±3.35%       24
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > compress (serialize + gzip) 2136ms
   name                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.compress(754 kB -> 82.9 kB)  59.2159  14.6333  42.6205  17.4357  17.4945  37.3586  39.9896  42.0943  ±7.61%       46   fastest
   superjson.compress(2.82 MB -> 121 kB)         26.6899  36.2693  41.1821  37.5065  37.9559  40.9880  41.0851  41.1627  ±1.50%       22
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > decompress (gunzip + deserialize) 2139ms
   name                                                 hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.decompress(754 kB -> 82.9 kB)   258.38   3.4363   9.2610   3.9191   3.9884   6.7250   6.9793   8.7964  ±1.99%      205   fastest
   superjson.decompress(2.82 MB -> 121 kB)         58.2985  15.0163  22.4161  17.4477  19.9369  22.2959  22.3560  22.4041  ±4.07%       47
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1224ms
   name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  836,559.34  0.0010  0.2040  0.0012  0.0012  0.0016  0.0018  0.0064  ±0.17%   657110
```

### Bun 1.4.3

```
 RUN  v5.0.5 /home/user/github/httpx/packages/xcache

 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 12654ms
   name                                       hz     min     max    mean     p75     p99    p995    p999     rme   samples
   with cache (just lru)           14,397,898.71  0.0000  1.0169  0.0001  0.0001  0.0002  0.0002  0.0004  ±0.48%  10009247   fastest
   with cache                       4,997,422.52  0.0001  0.8566  0.0002  0.0002  0.0010  0.0013  0.0039  ±0.54%   3493158
   cache with json + deflate              807.99  1.0905  2.6692  1.2573  1.2588  2.2080  2.3087  2.6217  ±1.19%       637
   cache with superjson + deflate         775.25  1.0953  3.2749  1.3168  1.3663  2.3776  2.6560  3.0769  ±1.41%       608
   cache with devalue + deflate           350.60  2.3464  6.5923  2.9184  3.1768  4.4981  4.6188  6.0604  ±2.03%       275
   original function                      2.4933  400.70  401.27  401.08  401.14  401.26  401.27  401.27  ±0.03%        10   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > serialize native types 3205ms
   name                                              hz     min      max     mean      p75      p99     p995     p999     rme  samples
   json.serialize(974 kB) - native types       2,010.22  0.4320   1.9057   0.5057   0.5126   0.8497   1.0988   1.4207  ±0.85%     1583   fastest
   devalue.serialize(1.19 MB) - native types     166.63  4.1992  15.0555   6.3124   6.5931  13.3483  13.9923  14.8429  ±4.89%      127
   superjson.serialize(974 kB) - native types   99.7343  8.7260  14.8688  10.1254  10.4451  13.3958  14.1323  14.7215  ±2.39%       80   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > deserialize native types 3168ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   superjson.deserialize(974 kB) - native types  1,071.85  0.8321  2.1187  0.9413  0.9458  1.4394  1.5962  2.0019  ±0.77%      851   fastest
   json.deserialize(974 kB) - native types       1,047.95  0.8408  2.0693  0.9679  0.9747  1.6984  1.9283  2.0271  ±1.01%      827
   devalue.deserialize(1.19 MB) - native types     573.30  1.5199  3.0625  1.7707  1.8143  2.5890  2.7247  2.9259  ±1.26%      452   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > serialize extended types 2251ms
   name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.serialize(2.47 MB) - extended types    88.5487   8.1918  20.7223  11.7065  12.3826  20.0981  20.4102  20.6599  ±5.09%       69   fastest
   superjson.serialize(3.62 MB) - extended types  20.5091  43.2345  52.1202  48.8579  50.5410  52.0493  52.0848  52.1132  ±2.35%       17
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > deserialize extended types 2163ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types     176.78   4.9828   8.9045   5.6996   5.9128   7.1677   7.7340   8.6704  ±1.57%      141   fastest
   superjson.deserialize(3.62 MB) - extended types  42.7002  20.8380  28.6947  23.5868  25.0138  28.6349  28.6648  28.6887  ±3.05%       34
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > compress (serialize + gzip) 2130ms
   name                                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.compress(754 kB -> 83 kB)  89.2280   9.9837  13.4149  11.2316  11.5258  12.5859  13.0004  13.3320  ±1.12%       72   fastest
   superjson.compress(2.82 MB -> 121 kB)       54.5481  16.9414  20.0830  18.3625  18.8598  20.0356  20.0593  20.0783  ±1.25%       44
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > decompress (gunzip + deserialize) 2123ms
   name                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.decompress(754 kB -> 83 kB)   249.23   3.4743   5.6800   4.0495   4.2112   5.5777   5.6116   5.6663  ±1.43%      198   fastest
   superjson.decompress(2.82 MB -> 121 kB)       76.8901  11.4518  15.2440  13.0690  13.4718  15.1195  15.1817  15.2315  ±1.82%       62
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1276ms
   name                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  1,546,246.21  0.0005  0.6842  0.0007  0.0007  0.0024  0.0039  0.0060  ±0.36%  1153536
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/xcache/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts)

| Scenario (esm)                                         | Size (compressed) |
| ------------------------------------------------------ | ----------------: |
| `import { XMemCache } from '@httpx/xcache`             |          ~ 1.79kB |
| `import { createHonoXCache } from '@httpx/xcache/hono` |          ~ 4.86kB |

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
| ES2022 | ✅ | Dist files checked with [es-check](https://github.com/yowainwright/es-check) |
| Performance | ✅ | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx) |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together! [Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>), or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
   </tr>
</table>

## License

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.
