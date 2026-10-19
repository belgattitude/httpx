---
"@httpx/xcache": minor
---

Add a `cacheControl` option to the hono helper (global or per call). No `Cache-Control` header is sent by default.

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
