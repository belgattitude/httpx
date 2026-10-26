---
"@httpx/lru": patch
---

Fix `TimeLruCache` keeping expired items in memory when accessed with `get()` or `has()`: they were unlinked from the lru list but not deleted, so their memory wasn't released, `size` still counted them and `onEviction` was called again on each access.
