---
"@httpx/xcache": minor
---

Add global and per call `enabled` / `compressionEnabled` options to `XMemCache` and `createHonoXCache`.

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
