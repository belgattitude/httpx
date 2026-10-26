# @httpx/xcache

## 0.12.0

### Minor Changes

- [#2868](https://github.com/belgattitude/httpx/pull/2868) [`7a456f9`](https://github.com/belgattitude/httpx/commit/7a456f98b560ca2ec27663392abdeb8daa4847bd) Thanks [@belgattitude](https://github.com/belgattitude)! - Add `CborxSerializer`, a binary serializer based on [cbor-x](https://github.com/kriszyp/cbor-x) (optional peer dependency).
  
  ```typescript
  import { CacheCompress } from "@httpx/xcache";
  import { CborxSerializer } from "@httpx/xcache/cbor-x";
  
  const compressor = new CacheCompress({
    serializer: new CborxSerializer(),
    algorithm: "gzip",
  });
  ```
  
  It supports extended types (Date, BigInt, Map, Set, undefined, NaN, typed arrays, shared and cyclic references) and is the fastest and smallest serializer with them. Defaults: `useRecords: true` (only readable by cbor-x) and `structuredClone: true`, other cbor-x options can be passed to the constructor.
  
  - New `ICacheBinarySerializer` interface (`binary: true`, `serialize` returns a `Uint8Array`), supported by `CacheCompress` (not as the `createHonoXCache` response serializer).
  - `ICacheSerializer` gets an optional `binary?: false` discriminant.

- [#2870](https://github.com/belgattitude/httpx/pull/2870) [`73bc155`](https://github.com/belgattitude/httpx/commit/73bc155442d24cb61ef99c6545181314b5d683dc) Thanks [@belgattitude](https://github.com/belgattitude)! - The namespace of the cache key is available in the `runAsync` meta (`meta.namespace`), the `runAsyncEntry` result (`namespace`, and `entry.namespace`) and the entry info returned by `getEntryInfo` and `getStats` (`namespace`).
  
  ```typescript
  const cache = new XMemCache({ lru, namespace: "shop" });
  const { meta } = await cache.runAsync({ key: ["/api/products"], fn });
  // meta.namespace: "shop"
  // meta.generatedKey: '{"key":["/api/products"],"ns":"shop"}'
  
  cache.getStats().entries; // [{ key: '{"key":["/api/products"],"ns":"shop"}', namespace: "shop", ... }]
  ```
  
  It's undefined for an empty namespace (not part of the generated key either), and for entries created by older versions in a shared lru. As `getStats()` lists the entries of every `XMemCache` instance sharing the lru, the namespace tells which instance created them.

- [#2868](https://github.com/belgattitude/httpx/pull/2868) [`7a456f9`](https://github.com/belgattitude/httpx/commit/7a456f98b560ca2ec27663392abdeb8daa4847bd) Thanks [@belgattitude](https://github.com/belgattitude)! - Breaking: serializers requiring an optional peer dependency moved to their own entry.
  
  The root entry imported `superjson` and `devalue`, so importing `@httpx/xcache` failed (ie: node, `ERR_MODULE_NOT_FOUND`) when one of these optional peer dependencies wasn't installed. The root entry now has no peer dependency import.
  
  ```typescript
  // Before
  import { SuperjsonSerializer, DevalueSerializer } from "@httpx/xcache";
  // After
  import { SuperjsonSerializer } from "@httpx/xcache/superjson";
  import { DevalueSerializer } from "@httpx/xcache/devalue";
  ```
  
  `JsonSerializer` and the interfaces (`ICacheSerializer`, `ICacheBinarySerializer`...) are still exported by `@httpx/xcache`.

- [#2868](https://github.com/belgattitude/httpx/pull/2868) [`7a456f9`](https://github.com/belgattitude/httpx/commit/7a456f98b560ca2ec27663392abdeb8daa4847bd) Thanks [@belgattitude](https://github.com/belgattitude)! - JSON detection with superjson: plain data is stored as JSON and read with `JSON.parse`.
  
  `CacheCompress` has a new `detectJson` option (default `true`): with `SuperjsonSerializer`, data without extended types is stored as plain JSON (`meta.content: "json"`) and read with `JSON.parse`. The detection has no extra cost (superjson only adds a meta when it encountered extended types). `DevalueSerializer` doesn't support it (its output is never plain JSON).
  
  - `ICacheSerializer` gets an optional `serializeWithJsonDetection`, implemented by `SuperjsonSerializer`.
  - `ICacheCompressor` gets an optional `supportsJsonDetection()`.
  - `createHonoXCache` sends plain JSON entries as-is (`Content-Encoding`) to json responses, ie: an `XMemCache` instance with a superjson compressor. The caches it creates don't detect JSON, the compressed bytes always match the response serializer.

- [#2864](https://github.com/belgattitude/httpx/pull/2864) [`a33908f`](https://github.com/belgattitude/httpx/commit/a33908fad68e10e19457323a0452892ce75833c6) Thanks [@belgattitude](https://github.com/belgattitude)! - Timings, usage and savings statistics, strings compressed without serializer.
  
  #### Timings
  
  The time spent creating cache entries (cache miss) is stored in `timings`, returned in the `runAsync` meta (on a cache hit: the timings of the execution that created the entry) and by `getStats()` / `getEntryInfo()`. On cache hits of compressed entries, `meta.readTimings` returns the time spent reading the entry for this call.
  
  ```typescript
  const { meta } = await xMemCache.runAsync({ key: ["/api/data"], fn });
  // meta.timings (milliseconds, max 2 decimals)
  // {
  //   fn: 152.37,      // time taken by the cached function
  //   serialize: 3.12, // absent when not serialized (no compressor, strings...)
  //   compress: 8.4,   // absent when compression wasn't attempted
  // }
  
  // compressed cache hits (deserialize is absent for strings)
  // meta.readTimings: { decompress: 1.05, deserialize: 2.3 }
  ```
  
  `CacheCompress.compress()` returns the serialization and compression times in `timings`, and `CacheCompress.decompress(data, timings?)` fills the provided object with the decompression and deserialization times (both optional for custom `ICacheCompressor`). `XMemCache.readEntry(entry, timings?)` accepts the same object.
  
  #### Usage and savings
  
  ```typescript
  const { entries, totals } = xMemCache.getStats();
  // entries[0].timings: { fn: 152.37, serialize: 3.12, compress: 8.4 }
  // entries[0].usage (since the entry creation, dropped when it expires)
  // { hits: 42, deduped: 3, avgReadTime: 1.12, savedTime: 6798.09 }
  
  // totals (since the instance creation, kept when entries expire or on clear)
  // { hits: 1250, misses: 80, deduped: 12, bypassed: 5, savedTime: 184320.12 }
  
  xMemCache.resetStats(); // reset the totals
  ```
  
  `savedTime` (milliseconds) is the function time of hits and deduped calls, minus the read time of hits (decompress + deserialize) and the time spent serializing / compressing on misses. It can be negative when caching a key costs more than it saves.
  
  #### Strings and numbers are never serialized
  
  `CacheCompress` never calls the serializer for strings and numbers: numbers are never compressed (trivial values), strings are compressed as-is (`meta.content: "string"`) and returned without deserialization. Compressed strings are smaller and faster to read (ie: no JSON quoting/escaping).
  
  Note for `createHonoXCache`: compressed string results (`content: "string"`) are decompressed and serialized for the response, the compressed bytes are only sent as-is (`Content-Encoding`) for data compressed with the response serializer.

## 0.11.0

### Minor Changes

- [#2861](https://github.com/belgattitude/httpx/pull/2861) [`5223157`](https://github.com/belgattitude/httpx/commit/52231572a445a470c6f947c84b02babf614e53cb) Thanks [@belgattitude](https://github.com/belgattitude)! - Add abort signal support to `runAsync` and `runAsyncEntry`.
  
  ```typescript
  const { data } = await xMemCache.runAsync({
    key: ["/api/products", { id }],
    // 👇 the function receives the signal
    fn: ({ signal }) =>
      fetch(`/api/products/${id}`, { signal }).then((r) => r.json()),
    signal: AbortSignal.timeout(5_000),
  });
  ```
  
  - The call rejects with the signal reason as soon as it's aborted (even if the function ignores the signal), already aborted signals reject immediately, cache hits included.
  - Results of aborted executions are never stored.
  - With dedupe, aborting a call only rejects that call: the shared execution is aborted when all the waiting calls are aborted, and an aborted execution is never joined.
  - Hono: pass `signal: c.req.raw.signal` to abort when the client disconnects, a `499` response is returned instead of throwing.

- [#2859](https://github.com/belgattitude/httpx/pull/2859) [`0153ce9`](https://github.com/belgattitude/httpx/commit/0153ce9402cf1b2fdf7ea51ee7506f5986c49ba6) Thanks [@belgattitude](https://github.com/belgattitude)! - Deduplicate concurrent calls (cache stampede protection), enabled by default.
  
  On a cache miss, concurrent calls having the same generated key now share the in-flight function execution: the function runs once and all the callers get its result (or its error, errors are still not cached).
  
  ```typescript
  const xMemCache = new XMemCache({
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 120_000 }),
    dedupe: true, // 👈 default, can be disabled globally
  });
  
  const [a, b] = await Promise.all([
    xMemCache.runAsync({ key: ["/api/data"], fn: () => fetchThings() }),
    xMemCache.runAsync({ key: ["/api/data"], fn: () => fetchThings() }),
  ]);
  // 👆 fetchThings is called once, b.meta.deduped === true
  
  // 👇 or per call
  await xMemCache.runAsync({ key: ["/api/data"], fn, dedupe: false });
  ```
  
  - `runAsync` returns `meta.deduped: true` and `runAsyncEntry` returns `deduped: boolean`.
  - Calls with `forceRevalidate: true` never wait for an in-flight execution, and bypassed calls (`enabled: false`) are never deduplicated.
  - Hono: `createHonoXCache` accepts the `dedupe` option (and `dedupe` param per call). With `debugHeaders`, deduplicated responses have a `X-XCache: DEDUPED` header. They share the entry of the original response (same `ETag`), and are sent compressed only when their own `Accept-Encoding` allows it.
  - Docs: browsers don't allow setting `Accept-Encoding` (forbidden header), requests created in a browser (ie: hono in a service worker, `app.request()` in browser tests) never get a `Content-Encoding` response.

## 0.10.0

### Minor Changes

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Performance improvements for `XMemCache` and `CacheCompress`.
  
  - Faster cache key generation (~40% faster), `runAsync` cache hits are ~25% faster. Generated keys are unchanged.
  - `CacheCompress` now stores the compressed data as a `Uint8Array` by default (new `encoding: "binary"` option), saving ~25% memory and the base64 encoding/decoding cost. Use `encoding: "base64"` or `"base64_urlsafe"` to keep the previous string output.
  
  **Breaking (types)**: `CacheCompressResult.data` on success is now `string | Uint8Array`.

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Raise `CacheCompress` defaults to avoid compressing small payloads, where the cpu cost outweighs the memory saving:
  
  - `minimumByteSaving`: 32 KB (was 16 KB), compression is skipped when it saves less than 32 KB.
  - `minimumStringLength`: 16K characters (was 1000). It's now also checked on the serialized data (not only on string data): payloads serializing to less than this are never compressed.
  
  Small payloads are skipped before compression (no gzip/deflate work) when the serialized data is shorter than `minimumStringLength`, or shorter than `minimumByteSaving` (the saving can't exceed it).
  
  To keep the previous behaviour:
  
  ```typescript
  new CacheCompress({
    serializer,
    algorithm: "gzip",
    minimumByteSaving: 16_384,
    minimumStringLength: 1000,
  });
  ```

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Store compression meta with compressed cache entries and prevent reading incompatible entries.
  
  - Compressed entries now record the `algorithm`, `encoding`, `serializer`, `originalSize`, `compressedSize` and `ratio` used to store them. They are returned by `XMemCache.runAsync()` in `meta.compression`.
  - On a cache hit, an existing compressed entry created with a different algorithm, encoding or serializer is treated as a cache miss (function executed again, entry replaced) instead of being decoded with the wrong settings.
  - New optional `ICacheCompressor.isCompatible(meta)` method, implemented by `CacheCompress`. `CacheCompress.decompress()` throws a `TypeError` for incompatible data.
  - New exported types: `CacheCompressAlgorithm`, `CacheCompressEncoding`, `CacheCompressResult`, `CacheCompressSuccessMeta`.
  
  **Breaking (types)**: `CacheCompressSuccessMeta` now requires `algorithm`, `encoding` and `serializer` (only relevant for custom `ICacheCompressor` implementations).

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add global and per call `enabled` / `compressionEnabled` options to `XMemCache` and `createHonoXCache`.
  
  ```typescript
  const xMemCache = new XMemCache({
    lru,
    compressor,
    // Global
    enabled: process.env.XCACHE_ENABLED !== "false",
    compressionEnabled: process.env.NODE_ENV === "production",
  });
  
  const { data, meta } = await xMemCache.runAsync({
    key: ["/api/data", params],
    fn: () => fetchThings(params),
    // Per call, overrides the global options
    enabled: !params.preview,
    compressionEnabled: false,
  });
  ```
  
  - `enabled: false`: the function is always executed and the cache is neither read nor written. `runAsync` returns `meta.bypassed: true`, `runAsyncEntry` returns `bypassed`, the hono helper sends `X-XCache: BYPASS` (debug headers) and no `ETag`.
  - `compressionEnabled: false`: entries are stored as-is (reported with `skippedReason: "compression_disabled"` in stats). Cache keys are unchanged and existing compressed entries can still be read.
  - New readonly `XMemCache.enabled` and `XMemCache.compressionEnabled` getters.

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add a `cacheControl` option to the hono helper (global or per call). No `Cache-Control` header is sent by default.
  
  ```typescript
  const xcache = createHonoXCache({
    lru,
    // max-age = remaining ttl of the server cache entry
    cacheControl: { maxAge: "ttl", scope: "private", staleWhileRevalidate: 30 },
  });
  
  app.get("/api/products/:id", (c) =>
    xcache.json(c, {
      key: ["/api/products", { id: c.req.param("id") }],
      fn: () => fetchProduct(c.req.param("id")),
      cacheControl: "public, max-age=60", // per call override
    })
  );
  ```
  
  - `false` (default): no header, `string`: sent as-is, `{ maxAge: number | "ttl", scope?: "private" | "public", staleWhileRevalidate?: number }`: built header, `scope` defaults to `private`.
  - A `Cache-Control` provided in `headers` takes precedence. Nothing is sent when the cache is bypassed, `304` responses keep the header.
  - `XMemCache.runAsyncEntry()` now also returns `expiresIn`, the remaining time to live of the entry.
  - New exported types: `HonoXCacheControl`, `HonoXCacheControlOptions`.
  
  Documented error handling: errors thrown by `fn` are not cached (retried on the next call) and an existing entry is kept when a revalidation fails.

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - `createHonoXCache` accepts an existing `XMemCache` instance, and hono cache keys now include their origin.
  
  ```typescript
  const xcache = createHonoXCache({ cache: xMemCache });
  ```
  
  - With an instance, its lru, namespace, compressor and enabled options are used. Compressed entries created with the same serializer are sent as-is (base64 entries are decoded first), entries compressed with another serializer are re-serialized with the helper serializer.
  - Keys created by the hono helper include an `"origin":"hono"` part, so routes and `runAsync()` calls with the same key on the same instance don't share entries. Keys created by `runAsync()` are unchanged.
  - New `origin` param on `runAsync()`, `runAsyncEntry()` and `getEntryInfo()`, new `XMemCache.readEntry(entry)` to get the data of an entry returned by `runAsyncEntry()`, new `HonoXCache.getEntryInfo()`.
  - New exports: `honoXCacheOrigin`, `HonoXCacheLruOptions`, `HonoXCacheInstanceOptions` types.

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add a hono helper, exported from `@httpx/xcache/hono` (`hono` is an optional peer dependency).
  
  ```typescript
  import { TimeLruCache } from "@httpx/xcache";
  import { createHonoXCache } from "@httpx/xcache/hono";
  import { Hono } from "hono";
  
  const xcache = createHonoXCache({
    lru: new TimeLruCache({ maxSize: 500, defaultTTL: 60_000 }),
  });
  
  const app = new Hono();
  
  app.get("/api/products/:id", (c) =>
    xcache.json(c, {
      key: ["/api/products", { id: c.req.param("id") }],
      fn: () => fetchProduct(c.req.param("id")),
    })
  );
  ```
  
  - Compressed entries are sent as-is (`Content-Encoding: gzip|deflate`) when the client accepts the algorithm, without decompression nor serialization. Otherwise they are decompressed.
  - Weak `ETag` with `304 Not Modified` support (`If-None-Match`), `Vary: Accept-Encoding`, optional `X-XCache: HIT|MISS` debug header.
  - Works with any serializer (`contentType` option), compression can be disabled.
  
  Also new in the core:
  
  - `XMemCache.runAsyncEntry()` returns the stored entry as-is (compressed data is not decompressed).
  - Cache entries record their creation time (`createdAt`), also returned by `getStats()` and `getEntryInfo()`.
  - New exported types: `XMemCacheRunAsyncParams`, `XMemCacheRunAsyncEntryResult`.

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add `XMemCache.getStats()` and `XMemCache.getEntryInfo()`.
  
  ```typescript
  const {
    items,
    nativeItems,
    compressedItems,
    compressedSize,
    originalSize,
    entries,
  } = xMemCache.getStats();
  
  const info = xMemCache.getEntryInfo({ key: ["/api/data", params] });
  // { key, format: "compressed", size, compression: { algorithm, encoding, serializer, originalSize, compressedSize, ratio } }
  ```
  
  - Each entry exposes its generated key, its format (`native` or `compressed`), its size and compression meta when compressed, or the reason compression was skipped, and its remaining time to live (`expiresIn`, from the new `TimeLruCache.expiresIn()`).
  - Expired entries are ignored, the lru order is not affected.
  - Values stored by `XMemCache` are now branded: when the lru is shared with other code, values not created by `XMemCache` (even if they look alike) are ignored by the stats and treated as a cache miss by `runAsync()`. The `isXMemCacheEntry()` typeguard is exported.
  - New exported types: `XMemCacheStats`, `XMemCacheEntryInfo`, `XMemCacheEntry`.

### Patch Changes

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Faster `runAsync()` / `runAsyncEntry()` cache hits (~+25%): the hit is resolved without awaiting an intermediate async function, and the result meta is built without object spreads.

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Hono helper fixes (from review):
  
  - `Vary: Accept-Encoding` is now merged with a caller-provided `Vary` header (any casing) instead of overwriting it, ie: `Vary: Cookie` becomes `Vary: Cookie, Accept-Encoding`.
  - A replacement cache entry (ie: `forceRevalidate`) always gets a more recent `createdAt` than the entry it replaces, so the ETag changes even when revalidated within the same millisecond (no stale `304`).

- [#2846](https://github.com/belgattitude/httpx/pull/2846) [`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a) Thanks [@belgattitude](https://github.com/belgattitude)! - Document how to choose a serializer in the README.
  
  - A serializer is only needed when compression is enabled, without a compressor values are stored as-is.
  - Memory gains per serializer (json, superjson, superjson+dedupe, devalue) versus uncompressed live objects: from -86% to -96% on the benchmarked datasets.
  - Performance and size comparison table with recommendations, advantages and drawbacks of each serializer, and how to enable superjson `dedupe` with a custom serializer.
  - Benchmarks updated for Node 26.12.0 and Bun 1.4.3.
- Updated dependencies [[`18951cb`](https://github.com/belgattitude/httpx/commit/18951cb6240c7b364607a93e963f13bc3c65c11a)]:
  - @httpx/lru@0.16.0

## 0.9.0

### Minor Changes

- [#2836](https://github.com/belgattitude/httpx/pull/2836) [`1a4c058`](https://github.com/belgattitude/httpx/commit/1a4c0580bfc5f4eaf7fe65f8dcfda8e279702fae) Thanks [@belgattitude](https://github.com/belgattitude)! - ESM only (drop CJS) and require node >= 22.
  
  Remove official support for the Vercel edge-runtime. It is still expected to work, but compatibility is not enforced on CI anymore (`test-unit-edge` removed).
  
  Faster cache hits with compression, thanks to the faster base64 decoding of `@httpx/compress`:
  
  | Runtime    | json + deflate | superjson + deflate | devalue + deflate |
  | ---------- | -------------: | ------------------: | ----------------: |
  | Node 24.21 |           1.9x |                2.0x |              2.2x |
  | Node 26.10 |           2.2x |                2.1x |              2.1x |
  | Bun 1.4.3  |           1.1x |                1.4x |              1.4x |
  
  > `XMemCache.runAsync()` cache hits on a 46.7 MB payload (see `bench/x-mem-cache.bench.ts`).

### Patch Changes

- Updated dependencies [[`1a4c058`](https://github.com/belgattitude/httpx/commit/1a4c0580bfc5f4eaf7fe65f8dcfda8e279702fae)]:
  - @httpx/compress@0.5.0

## 0.8.1

### Patch Changes

- [#2824](https://github.com/belgattitude/httpx/pull/2824) [`b7c59da`](https://github.com/belgattitude/httpx/commit/b7c59da21e2be424292aaab104acddeb111a0007) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal refactors (stricter boolean checks, loops instead of forEach/reduce), build with tsdown 0.23
- Updated dependencies [[`b7c59da`](https://github.com/belgattitude/httpx/commit/b7c59da21e2be424292aaab104acddeb111a0007), [`b7c59da`](https://github.com/belgattitude/httpx/commit/b7c59da21e2be424292aaab104acddeb111a0007)]:
  - @httpx/compress@0.4.1
  - @httpx/lru@0.15.1
  - @httpx/stable-hash@0.5.1

## 0.8.0

### Minor Changes

- [#2821](https://github.com/belgattitude/httpx/pull/2821) [`c637df8`](https://github.com/belgattitude/httpx/commit/c637df8bc04f18f22077120eba9d88a3177331f0) Thanks [@belgattitude](https://github.com/belgattitude)! - Support devalue v6

## 0.7.0

### Minor Changes

- [#2808](https://github.com/belgattitude/httpx/pull/2808) [`7231f1f`](https://github.com/belgattitude/httpx/commit/7231f1f0dd23aaa833e43ce736ae94947e5205b7) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove tests on node 20 from the CI matrix

### Patch Changes

- [#2808](https://github.com/belgattitude/httpx/pull/2808) [`7231f1f`](https://github.com/belgattitude/httpx/commit/7231f1f0dd23aaa833e43ce736ae94947e5205b7) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild using latest rolldown / tsdown

  ```
  tsdown v0.22.14 powered by rolldown v1.2.3
  targets chrome109 edge149 firefox121 ios16.6 opera127 safari18.5
  ```

- [#2808](https://github.com/belgattitude/httpx/pull/2808) [`7231f1f`](https://github.com/belgattitude/httpx/commit/7231f1f0dd23aaa833e43ce736ae94947e5205b7) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal: move tsconfig aliases to source exports

- Updated dependencies [[`7231f1f`](https://github.com/belgattitude/httpx/commit/7231f1f0dd23aaa833e43ce736ae94947e5205b7), [`7231f1f`](https://github.com/belgattitude/httpx/commit/7231f1f0dd23aaa833e43ce736ae94947e5205b7), [`7231f1f`](https://github.com/belgattitude/httpx/commit/7231f1f0dd23aaa833e43ce736ae94947e5205b7)]:
  - @httpx/stable-hash@0.5.0
  - @httpx/compress@0.4.0
  - @httpx/lru@0.15.0

## 0.6.1

### Patch Changes

- [#2797](https://github.com/belgattitude/httpx/pull/2797) [`a284cdc`](https://github.com/belgattitude/httpx/commit/a284cdc5455b519abd7dcd4eb7ec3f024fdc4458) Thanks [@belgattitude](https://github.com/belgattitude)! - No code change, rebuild with latest tsdown

- [#2797](https://github.com/belgattitude/httpx/pull/2797) [`a284cdc`](https://github.com/belgattitude/httpx/commit/a284cdc5455b519abd7dcd4eb7ec3f024fdc4458) Thanks [@belgattitude](https://github.com/belgattitude)! - Tested on node 26.x

- Updated dependencies [[`a284cdc`](https://github.com/belgattitude/httpx/commit/a284cdc5455b519abd7dcd4eb7ec3f024fdc4458), [`a284cdc`](https://github.com/belgattitude/httpx/commit/a284cdc5455b519abd7dcd4eb7ec3f024fdc4458)]:
  - @httpx/stable-hash@0.4.2
  - @httpx/compress@0.3.14
  - @httpx/lru@0.14.1

## 0.6.0

### Minor Changes

- [#2773](https://github.com/belgattitude/httpx/pull/2773) [`4536b07`](https://github.com/belgattitude/httpx/commit/4536b07f768df9b391af9872e2a7ef17e7031474) Thanks [@belgattitude](https://github.com/belgattitude)! - Support forceRevalidate in runAsync

### Patch Changes

- Updated dependencies [[`4536b07`](https://github.com/belgattitude/httpx/commit/4536b07f768df9b391af9872e2a7ef17e7031474)]:
  - @httpx/lru@0.14.0

## 0.5.2

### Patch Changes

- [#2724](https://github.com/belgattitude/httpx/pull/2724) [`ebcef3c`](https://github.com/belgattitude/httpx/commit/ebcef3c78563dafe3f5a95717277b6a4a0d1adac) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild using latest tsdown 0.22 and rolldown v1 (no code change)

- Updated dependencies [[`ebcef3c`](https://github.com/belgattitude/httpx/commit/ebcef3c78563dafe3f5a95717277b6a4a0d1adac), [`bf7d1ae`](https://github.com/belgattitude/httpx/commit/bf7d1ae5a8038d0207f7cb390e799f1c07ebf8ef)]:
  - @httpx/stable-hash@0.4.1
  - @httpx/compress@0.3.13
  - @httpx/lru@0.13.4

## 0.5.1

### Patch Changes

- Updated dependencies [[`f73db14`](https://github.com/belgattitude/httpx/commit/f73db1403560cbc26a07afd1bc9dd4134ab994eb)]:
  - @httpx/stable-hash@0.4.0

## 0.5.0

### Minor Changes

- [#2675](https://github.com/belgattitude/httpx/pull/2675) [`dfd7d10`](https://github.com/belgattitude/httpx/commit/dfd7d10aab8aad19f7cab0dd2f7253cabc6f36e5) Thanks [@belgattitude](https://github.com/belgattitude)! - Build with tsdown - update benchmarks

### Patch Changes

- Updated dependencies [[`dfd7d10`](https://github.com/belgattitude/httpx/commit/dfd7d10aab8aad19f7cab0dd2f7253cabc6f36e5), [`dfd7d10`](https://github.com/belgattitude/httpx/commit/dfd7d10aab8aad19f7cab0dd2f7253cabc6f36e5), [`dfd7d10`](https://github.com/belgattitude/httpx/commit/dfd7d10aab8aad19f7cab0dd2f7253cabc6f36e5)]:
  - @httpx/compress@0.3.12
  - @httpx/lru@0.13.2

## 0.4.12

### Patch Changes

- [#2673](https://github.com/belgattitude/httpx/pull/2673) [`c33262d`](https://github.com/belgattitude/httpx/commit/c33262d028d0b5ce5ff2dd64e8e6bd6a0eb74d48) Thanks [@belgattitude](https://github.com/belgattitude)! - Re-enable cloudflare tests in CI

- Updated dependencies [[`c33262d`](https://github.com/belgattitude/httpx/commit/c33262d028d0b5ce5ff2dd64e8e6bd6a0eb74d48)]:
  - @httpx/stable-hash@0.3.8
  - @httpx/compress@0.3.11
  - @httpx/lru@0.13.1

## 0.4.11

### Patch Changes

- [#2659](https://github.com/belgattitude/httpx/pull/2659) [`b05d4f6`](https://github.com/belgattitude/httpx/commit/b05d4f60f06da0a33235345dd932ed9cd6467b48) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix jsdoc and improve readme

## 0.4.10

### Patch Changes

- Updated dependencies [[`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748)]:
  - @httpx/lru@0.13.0

## 0.4.9

### Patch Changes

- [#2652](https://github.com/belgattitude/httpx/pull/2652) [`2cbe861`](https://github.com/belgattitude/httpx/commit/2cbe861ea41bd5a7b4d0542c4c891aa67570395b) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

  PS: due to a failing ci action, the correct changes can be found in [#2648](https://github.com/belgattitude/httpx/pull/2648)

- Updated dependencies [[`2cbe861`](https://github.com/belgattitude/httpx/commit/2cbe861ea41bd5a7b4d0542c4c891aa67570395b)]:
  - @httpx/stable-hash@0.3.7
  - @httpx/compress@0.3.10
  - @httpx/lru@0.12.4

## 0.4.8

### Patch Changes

- [#2650](https://github.com/belgattitude/httpx/pull/2650) [`a30cf76`](https://github.com/belgattitude/httpx/commit/a30cf7699e9950315ebc4002a9f387929935da75) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

  PS: due a failing ci action, the correct changes can be found in [#2648](https://github.com/belgattitude/httpx/pull/2648)

- Updated dependencies [[`a30cf76`](https://github.com/belgattitude/httpx/commit/a30cf7699e9950315ebc4002a9f387929935da75)]:
  - @httpx/stable-hash@0.3.6
  - @httpx/compress@0.3.9
  - @httpx/lru@0.12.3

## 0.4.7

### Patch Changes

- [#2648](https://github.com/belgattitude/httpx/pull/2648) [`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

- Updated dependencies [[`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee)]:
  - @httpx/stable-hash@0.3.5
  - @httpx/compress@0.3.8
  - @httpx/lru@0.12.2

## 0.4.6

### Patch Changes

- [#2643](https://github.com/belgattitude/httpx/pull/2643) [`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c) Thanks [@belgattitude](https://github.com/belgattitude)! - Enable CI for bun latest on CI (bun 1.3.3)

- Updated dependencies [[`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c)]:
  - @httpx/stable-hash@0.3.4
  - @httpx/compress@0.3.7
  - @httpx/lru@0.12.1

## 0.4.5

### Patch Changes

- [#2632](https://github.com/belgattitude/httpx/pull/2632) [`087482a`](https://github.com/belgattitude/httpx/commit/087482a0c7d29441d40e1c044717299ccb8a0653) Thanks [@belgattitude](https://github.com/belgattitude)! - Update minimum peer-deps for devalue and superjson to latest. They bring fixes and some
  speedup.

  ```json
  {
    "peerDependencies": {
      "devalue": "^5.4.2",
      "superjson": "^2.2.5"
    },
    "peerDependenciesMeta": {
      "devalue": {
        "optional": true
      },
      "superjson": {
        "optional": true
      }
    }
  }
  ```

## 0.4.4

### Patch Changes

- Updated dependencies [[`6c2486e`](https://github.com/belgattitude/httpx/commit/6c2486e082cdeacee0969a359213570aef512a04)]:
  - @httpx/lru@0.12.0

## 0.4.3

### Patch Changes

- [`cc363ff`](https://github.com/belgattitude/httpx/commit/cc363ff36a48aece196423ee61f59a3c6cee48db) Thanks [@belgattitude](https://github.com/belgattitude)! - No code change, maintenance release to rebuild with latest esbuild.

- Updated dependencies [[`cc363ff`](https://github.com/belgattitude/httpx/commit/cc363ff36a48aece196423ee61f59a3c6cee48db)]:
  - @httpx/stable-hash@0.3.3
  - @httpx/compress@0.3.6
  - @httpx/lru@0.11.5

## 0.4.2

### Patch Changes

- [#2482](https://github.com/belgattitude/httpx/pull/2482) [`e4eae87`](https://github.com/belgattitude/httpx/commit/e4eae87f118ea6f0fbd46611e4dd2697b8adf9a1) Thanks [@belgattitude](https://github.com/belgattitude)! - Base64 perf improvements by using "uint8array-extras:^1.5.0"

  See: https://github.com/sindresorhus/uint8array-extras/releases/tag/v1.5.0

- Updated dependencies [[`e4eae87`](https://github.com/belgattitude/httpx/commit/e4eae87f118ea6f0fbd46611e4dd2697b8adf9a1)]:
  - @httpx/compress@0.3.5

## 0.4.1

### Patch Changes

- [#2463](https://github.com/belgattitude/httpx/pull/2463) [`1a75006`](https://github.com/belgattitude/httpx/commit/1a75006e9a544360299320ce84ca5ce5e68caf22) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.25.9 (no code change)

- Updated dependencies [[`1a75006`](https://github.com/belgattitude/httpx/commit/1a75006e9a544360299320ce84ca5ce5e68caf22)]:
  - @httpx/stable-hash@0.3.2
  - @httpx/compress@0.3.4
  - @httpx/lru@0.11.4

## 0.4.0

### Minor Changes

- [#2432](https://github.com/belgattitude/httpx/pull/2432) [`27c391a`](https://github.com/belgattitude/httpx/commit/27c391abcd562888a7b615f342353fa02a0f0383) Thanks [@belgattitude](https://github.com/belgattitude)! - Add compression utilities

### Patch Changes

- [#2434](https://github.com/belgattitude/httpx/pull/2434) [`eb09668`](https://github.com/belgattitude/httpx/commit/eb0966865e27885ade11d46bb533be3223eb4176) Thanks [@belgattitude](https://github.com/belgattitude)! - Cache compression: add support deflate (slightly faster than gzip).

- Updated dependencies [[`eb09668`](https://github.com/belgattitude/httpx/commit/eb0966865e27885ade11d46bb533be3223eb4176)]:
  - @httpx/compress@0.3.2

## 0.3.0

### Minor Changes

- [#2426](https://github.com/belgattitude/httpx/pull/2426) [`714b5d1`](https://github.com/belgattitude/httpx/commit/714b5d11e09990d8e4e8eb4e5018969d7a662b1a) Thanks [@belgattitude](https://github.com/belgattitude)! - Rework internal and improve cache key handling.

## 0.2.1

### Patch Changes

- [#2418](https://github.com/belgattitude/httpx/pull/2418) [`6915894`](https://github.com/belgattitude/httpx/commit/691589482047c4ffb48a3e66c5d4a18a15b4d0d2) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.28.8

- Updated dependencies [[`6915894`](https://github.com/belgattitude/httpx/commit/691589482047c4ffb48a3e66c5d4a18a15b4d0d2)]:
  - @httpx/stable-hash@0.3.1
  - @httpx/compress@0.3.1
  - @httpx/lru@0.11.3

## 0.2.0

### Minor Changes

- [#2413](https://github.com/belgattitude/httpx/pull/2413) [`15c8850`](https://github.com/belgattitude/httpx/commit/15c88502d03ee5c49d4debe8d374e76c4cf414ce) Thanks [@belgattitude](https://github.com/belgattitude)! - Add initial alpha support for XMemCache

### Patch Changes

- Updated dependencies [[`15c8850`](https://github.com/belgattitude/httpx/commit/15c88502d03ee5c49d4debe8d374e76c4cf414ce)]:
  - @httpx/lru@0.11.2

## 0.1.0

### Minor Changes

- [#2371](https://github.com/belgattitude/httpx/pull/2371) [`8bc68fd`](https://github.com/belgattitude/httpx/commit/8bc68fd67eac8f1335ee61907562399818e23b3b) Thanks [@belgattitude](https://github.com/belgattitude)! - Drop node 18.x, require node 20.x, add node 24.x to CI

### Patch Changes

- Updated dependencies [[`8bc68fd`](https://github.com/belgattitude/httpx/commit/8bc68fd67eac8f1335ee61907562399818e23b3b)]:
  - @httpx/stable-hash@0.3.0
  - @httpx/compress@0.3.0
  - @httpx/lru@0.11.0

## 0.0.11

### Patch Changes

- Updated dependencies [[`a795daa`](https://github.com/belgattitude/httpx/commit/a795daa611f33942410777ddf7f561cf5e122028)]:
  - @httpx/stable-hash@0.2.3
  - @httpx/compress@0.2.4
  - @httpx/lru@0.10.1

## 0.0.10

### Patch Changes

- Updated dependencies [[`31dd527`](https://github.com/belgattitude/httpx/commit/31dd527a6139a555951278060c3c8c38fffbc157)]:
  - @httpx/lru@0.10.0

## 0.0.9

### Patch Changes

- [#2243](https://github.com/belgattitude/httpx/pull/2243) [`54a79d9`](https://github.com/belgattitude/httpx/commit/54a79d9c530da590f634011ece54e83755ca6d6a) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with tsup 8.5.0, includes a fix for cjs in certain usages

- Updated dependencies [[`54a79d9`](https://github.com/belgattitude/httpx/commit/54a79d9c530da590f634011ece54e83755ca6d6a)]:
  - @httpx/stable-hash@0.2.2
  - @httpx/compress@0.2.3

## 0.0.8

### Patch Changes

- Updated dependencies [[`8548046`](https://github.com/belgattitude/httpx/commit/8548046e58bed76f2e54c709acf92817316783a4)]:
  - @httpx/stable-hash@0.2.1
  - @httpx/compress@0.2.2
  - @httpx/lru@0.9.2

## 0.0.7

### Patch Changes

- Updated dependencies [[`7169124`](https://github.com/belgattitude/httpx/commit/71691247feb901db5912353de54d23bd3362d0e9), [`7169124`](https://github.com/belgattitude/httpx/commit/71691247feb901db5912353de54d23bd3362d0e9)]:
  - @httpx/lru@0.9.1

## 0.0.6

### Patch Changes

- Updated dependencies [[`e4d256d`](https://github.com/belgattitude/httpx/commit/e4d256d5511c007cba6c12bdb153ed5c52f151d1)]:
  - @httpx/compress@0.2.1

## 0.0.5

### Patch Changes

- Updated dependencies [[`e774441`](https://github.com/belgattitude/httpx/commit/e77444125a62954a779aca6b9797a4ecf56e716f)]:
  - @httpx/compress@0.2.0

## 0.0.4

### Patch Changes

- Updated dependencies [[`58ea168`](https://github.com/belgattitude/httpx/commit/58ea168357ac6cd80ba07fbf4b6afee85a7e8052), [`58ea168`](https://github.com/belgattitude/httpx/commit/58ea168357ac6cd80ba07fbf4b6afee85a7e8052), [`58ea168`](https://github.com/belgattitude/httpx/commit/58ea168357ac6cd80ba07fbf4b6afee85a7e8052)]:
  - @httpx/compress@0.1.0

## 0.0.3

### Patch Changes

- [`a6575d2`](https://github.com/belgattitude/httpx/commit/a6575d23cebd886ef1ea463eec7ffeba1baf3723) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial release of @httpx/xcache

## 0.0.2

### Patch Changes

- [#1954](https://github.com/belgattitude/httpx/pull/1954) [`a177cbe`](https://github.com/belgattitude/httpx/commit/a177cbed003543dd46df06d0bf6f56fd6af68338) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial draft release of xcache
