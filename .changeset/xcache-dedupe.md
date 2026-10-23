---
"@httpx/xcache": minor
---

Deduplicate concurrent calls (cache stampede protection), enabled by default.

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
- Hono: `createHonoXCache` accepts the `dedupe` option (and `dedupe` param per call). With `debugHeaders`, deduplicated responses have a `X-XCache: DEDUPED` header.
