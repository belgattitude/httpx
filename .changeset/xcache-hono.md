---
"@httpx/xcache": minor
---

Add a hono helper, exported from `@httpx/xcache/hono` (`hono` is an optional peer dependency).

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
