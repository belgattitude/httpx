---
"@httpx/xcache": minor
---

Add `expiresAt` (epoch milliseconds) to the entry info (`getEntryInfo()`, `getStats().entries`, where `expiresIn` and `expiresAt` are now always set) and `XMemCache.expiresAt(generatedKey)`, which also returns the expiry time of expired entries not removed yet (see `expiredEntries()`).
