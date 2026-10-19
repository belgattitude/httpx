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

    // Skip compression if the data is a string shorter than 1000 characters
    // @default 1000
    minimumStringLength: 1000,

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
- **Enable / disable**: `enabled` and `compressionEnabled` work as for `XMemCache`, globally or per call (ie: `xcache.json(c, { key, fn, enabled: c.req.query("nocache") === undefined })`). When the cache is bypassed, no `ETag` is sent. Prefer `compressionEnabled: false` over `compression: false` to toggle compression, as it keeps the same cache keys.
- **Cache-Control**: none by default, the data is only cached on the server (see [Cache-Control](#cache-control)).
- **Errors are not cached**: see [error handling](#error-handling).
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
    minimumStringLength: 1000,
    minimumByteSaving: 32_768,
  },
  etag: true,
  cacheControl: false, // see "Cache-Control"
  debugHeaders: false, // "X-XCache: HIT|MISS|BYPASS" header
  // Global enable / disable (see "Enable / disable")
  enabled: true,
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

 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 14126ms
   name                                    hz     min      max    mean     p75     p99     p995     p999     rme   samples
   with cache (just lru)        15,352,561.11  0.0000   2.5849  0.0001  0.0001  0.0002   0.0002   0.0004  ±0.86%  10368758   fastest
   with cache                    4,591,827.90  0.0001   0.2090  0.0002  0.0002  0.0004   0.0005   0.0007  ±0.24%   3534620
   cache with superjson + gzip         485.39  1.7499   6.9875  2.1485  2.0565  4.5418   4.9750   6.8875  ±2.92%       373
   cache with json + gzip              457.96  1.8646  22.8560  2.3410  2.2464  5.2485  15.7326  21.6311  ±7.35%       342
   cache with devalue + gzip           226.65  3.9722  11.3495  4.5163  4.3424  8.2525   8.6976  10.8191  ±2.88%       178
   original function                   2.4927  400.66   401.34  401.18  401.25  401.33   401.34   401.34  ±0.03%        10   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > serialize native types 3219ms
   name                                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   json.serialize(974 kB) - native types        693.14   1.2997   2.3043   1.4547   1.4919   1.9435   2.0664   2.1813  ±0.82%      550   fastest
   devalue.serialize(1.19 MB) - native types    110.04   7.6874  14.4778   9.2295   9.9369  13.0504  13.7641  14.3350  ±2.81%       87
   superjson.serialize(974 kB) - native types  84.3263  11.0169  19.7262  11.9406  12.1344  16.9537  18.3400  19.4490  ±2.40%       68   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > deserialize native types 3164ms
   name                                              hz     min     max    mean     p75     p99    p995    p999     rme  samples
   superjson.deserialize(974 kB) - native types  918.04  1.0183  2.0380  1.0940  1.1018  1.4098  1.4636  1.8186  ±0.54%      732   fastest
   json.deserialize(974 kB) - native types       903.45  1.0249  1.5636  1.1114  1.1229  1.4572  1.4887  1.5153  ±0.51%      720
   devalue.deserialize(1.19 MB) - native types   344.44  2.7012  3.7527  2.9144  2.9322  3.6432  3.6476  3.7240  ±0.79%      275   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > serialize extended types 2346ms
   name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.serialize(2.47 MB) - extended types    44.2795  20.2032  32.9322  22.7931  23.0227  31.7498  32.3410  32.8139  ±3.68%       36   fastest
   superjson.serialize(3.62 MB) - extended types  11.4471  82.3969   100.70  87.6623  88.0093   100.13   100.41   100.64  ±4.63%       10
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > deserialize extended types 2188ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types     107.85   8.0849  12.8885   9.3908  10.2126  11.8314  12.3599  12.7828  ±2.47%       86   fastest
   superjson.deserialize(3.62 MB) - extended types  31.1268  28.5058  39.6275  32.3122  34.1475  38.6950  39.1612  39.5342  ±3.26%       25
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > compress (serialize + gzip) 2163ms
   name                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.compress(754 kB -> 82.9 kB)  67.0665  13.5601  30.1134  15.2230  15.3503  29.8120  29.9627  30.0833  ±5.41%       53   fastest
   superjson.compress(2.82 MB -> 121 kB)         27.7031  33.8681  40.2637  36.1606  37.0774  39.8810  40.0723  40.2254  ±1.88%       23
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > decompress (gunzip + deserialize) 2115ms
   name                                                 hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.decompress(754 kB -> 82.9 kB)   264.59   3.4548   9.5076   3.8264   3.8286   6.8777   7.1020   9.0063  ±2.05%      210   fastest
   superjson.decompress(2.82 MB -> 121 kB)         57.0504  14.8538  21.9704  17.8425  20.4210  21.9642  21.9673  21.9698  ±4.17%       45
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1237ms
   name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  867,871.01  0.0010  0.1661  0.0012  0.0012  0.0017  0.0018  0.0067  ±0.19%   677897
```

### Bun 1.4.3

```
 RUN  v5.0.5 /home/user/github/httpx/packages/xcache

 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 13028ms
   name                                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   with cache (just lru)        14,155,116.12  0.0000  0.9959  0.0001  0.0001  0.0002  0.0002  0.0004  ±0.60%  9850138   fastest
   with cache                    5,260,364.13  0.0001  0.7365  0.0002  0.0002  0.0008  0.0011  0.0032  ±0.67%  3733557
   cache with json + gzip              816.50  1.0875  2.6411  1.2410  1.2553  2.2422  2.3423  2.4561  ±1.11%      645
   cache with superjson + gzip         812.65  1.0955  2.8384  1.2482  1.2562  2.2989  2.4763  2.6945  ±1.21%      641
   cache with devalue + gzip           386.16  2.3306  5.6202  2.6261  2.6479  3.9497  4.2457  5.2418  ±1.56%      305
   original function                   2.4926  400.18  403.52  401.18  401.13  403.32  403.42  403.50  ±0.16%       10   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > serialize native types 3196ms
   name                                              hz     min      max    mean     p75      p99     p995     p999     rme  samples
   json.serialize(974 kB) - native types       2,096.07  0.4318   1.4900  0.4821  0.4835   0.6625   1.0241   1.2005  ±0.67%     1660   fastest
   devalue.serialize(1.19 MB) - native types     188.43  3.7987  16.3470  5.6384  5.8015  12.8034  13.9273  15.8630  ±5.33%      142
   superjson.serialize(974 kB) - native types    104.29  8.6246  12.0991  9.6571  9.9714  11.9268  12.0130  12.0819  ±1.93%       84   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > deserialize native types 3168ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   superjson.deserialize(974 kB) - native types  1,089.85  0.8212  2.3098  0.9245  0.9337  1.3009  1.7000  1.9667  ±0.74%      866   fastest
   json.deserialize(974 kB) - native types         957.96  0.8440  3.7821  1.1378  1.1981  3.0900  3.3061  3.7413  ±2.90%      704
   devalue.deserialize(1.19 MB) - native types     589.04  1.5196  3.3868  1.7202  1.7260  2.7864  3.0288  3.3580  ±1.24%      466   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > serialize extended types 2199ms
   name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.serialize(2.47 MB) - extended types     113.19   7.4260  16.1098   9.1078   9.4000  15.7978  15.9538  16.0786  ±4.27%       88   fastest
   superjson.serialize(3.62 MB) - extended types  22.5379  37.3912  49.4339  44.6269  47.2697  49.3701  49.4020  49.4275  ±3.80%       18
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > deserialize extended types 2178ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types     188.75   4.8813   7.5496   5.3230   5.4352   6.8672   7.2055   7.4808  ±1.19%      151   fastest
   superjson.deserialize(3.62 MB) - extended types  45.7138  19.9913  24.0638  21.9466  22.8460  24.0518  24.0578  24.0626  ±1.93%       37
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > compress (serialize + gzip) 2120ms
   name                                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.compress(754 kB -> 83 kB)  96.7237   9.5901  13.0567  10.3604  10.6088  11.6732  12.3649  12.9183  ±1.08%       78   fastest
   superjson.compress(2.82 MB -> 121 kB)       56.2758  16.5873  22.4202  17.8470  18.0322  21.8129  22.1166  22.3594  ±2.13%       45
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > decompress (gunzip + deserialize) 2128ms
   name                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.decompress(754 kB -> 83 kB)   255.33   3.4682   6.1835   3.9492   4.0731   5.1324   5.2959   6.0045  ±1.37%      203   fastest
   superjson.decompress(2.82 MB -> 121 kB)       85.4515  10.7555  14.4643  11.7666  11.9456  14.3465  14.4054  14.4525  ±1.87%       69
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1274ms
   name                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  1,575,330.20  0.0005  0.6476  0.0007  0.0006  0.0023  0.0039  0.0063  ±0.35%  1175433
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/xcache/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts)

| Scenario (esm)                                         | Size (compressed) |
| ------------------------------------------------------ | ----------------: |
| `import { XMemCache } from '@httpx/xcache`             |          ~ 1.71kB |
| `import { createHonoXCache } from '@httpx/xcache/hono` |           ~ 4.7kB |

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
