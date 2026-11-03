---
"@httpx/xcache": minor
---

Add `XMemCache.expiredEntries()` to iterate over the expired entries not removed yet.

Breaking: `XMemCache` is no longer iterable, use `entries()` instead of `for (const [key, entry] of xMemCache)` or `[...xMemCache]`.
