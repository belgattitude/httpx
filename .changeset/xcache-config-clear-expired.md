---
"@httpx/xcache": minor
---

Add `XMemCache.clearExpired()`, `XMemCache.getConfig()` and report the original size of native entries in the statistics.

`clearExpired()` removes the expired entries from the lru (they're otherwise only removed when accessed or evicted) and returns the number of removed entries. Values not created by `XMemCache` (shared lru) are kept.

```typescript
setInterval(() => xMemCache.clearExpired(), 60_000).unref();
```

`getConfig()` returns the configuration of the instance: namespace, default ttl and maxSize (from the lru), enabled toggles and the compressor configuration (id, algorithm, encoding, serializer, binarySerializer, jsonDetection, thresholds). `CacheCompress` exposes it through the new optional `ICacheCompressor.getConfig()` method.

```typescript
const { ttl, compressor } = xMemCache.getConfig();
// compressor: { id: "cache-compress:superjson", algorithm: "gzip", encoding: "binary", serializer: "superjson", ... }
```

The original size is now reported whenever it was computed:

- `CacheCompress.compress()` returns the serialized length in the skipped meta (`meta.originalSize`) when compression was skipped after serialization (ie: `minimum_byte_saving_not_met`).
- `getEntryInfo()` and `getStats().entries` include `originalSize` for compressed entries, and for native entries when known (compression skipped after serialization, strings and `Uint8Array`).
- `getStats()` includes `nativeOriginalSize`, the total original size of the native entries having one.
