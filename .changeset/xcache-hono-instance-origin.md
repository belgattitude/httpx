---
"@httpx/xcache": minor
---

`createHonoXCache` accepts an existing `XMemCache` instance, and hono cache keys now include their origin.

```typescript
const xcache = createHonoXCache({ cache: xMemCache });
```

- With an instance, its lru, namespace, compressor and enabled options are used. Compressed entries created with the same serializer are sent as-is (base64 entries are decoded first), entries compressed with another serializer are re-serialized with the helper serializer.
- Keys created by the hono helper include an `"origin":"hono"` part, so routes and `runAsync()` calls with the same key on the same instance don't share entries. Keys created by `runAsync()` are unchanged.
- New `origin` param on `runAsync()`, `runAsyncEntry()` and `getEntryInfo()`, new `XMemCache.readEntry(entry)` to get the data of an entry returned by `runAsyncEntry()`, new `HonoXCache.getEntryInfo()`.
- New exports: `honoXCacheOrigin`, `HonoXCacheLruOptions`, `HonoXCacheInstanceOptions` types.
