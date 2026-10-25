---
"@httpx/xcache": minor
---

The namespace of the cache key is available in the `runAsync` meta (`meta.namespace`), the `runAsyncEntry` result (`namespace`, and `entry.namespace`) and the entry info returned by `getEntryInfo` and `getStats` (`namespace`).

```typescript
const cache = new XMemCache({ lru, namespace: "shop" });
const { meta } = await cache.runAsync({ key: ["/api/products"], fn });
// meta.namespace: "shop"
// meta.generatedKey: '{"key":["/api/products"],"ns":"shop"}'

cache.getStats().entries; // [{ key: '{"key":["/api/products"],"ns":"shop"}', namespace: "shop", ... }]
```

It's undefined for an empty namespace (not part of the generated key either), and for entries created by older versions in a shared lru. As `getStats()` lists the entries of every `XMemCache` instance sharing the lru, the namespace tells which instance created them.
