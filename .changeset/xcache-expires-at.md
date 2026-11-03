---
"@httpx/xcache": minor
---

Add `expiresAt` (epoch milliseconds) to the entry info (`getEntryInfo()`, `getStats().entries`) and `XMemCache.expiresAt(generatedKey)`, which also returns the expiry time of expired entries not removed yet (see `expiredEntries()`).
