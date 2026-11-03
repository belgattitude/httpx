---
"@httpx/lru": minor
"@httpx/xcache": patch
---

Add `TimeLruCache.expiresAt()` to get the expiry time of an entry (epoch milliseconds), also for expired entries not evicted yet.

`TimeLruCache.expiresIn()` is deprecated, use `expiresAt()` instead (see UPGRADE.md). XMemCache now uses `expiresAt()` internally.
