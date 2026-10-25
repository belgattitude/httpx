---
"@httpx/xcache": minor
---

Store the time taken by the function (in milliseconds, compression excluded) in cache entries, returned as `duration` in the `runAsync` meta (on a cache hit: the duration of the execution that created the entry), and by `getStats()` / `getEntryInfo()`.

```typescript
const { meta } = await xMemCache.runAsync({ key: ["/api/data"], fn });
// meta.duration: 152.37

const { entries } = xMemCache.getStats();
// entries[0].duration: 152.37
```
