---
"@httpx/lru": patch
---

Small perf improvement by keeping a reference to current size (O(1)) instead of map.size() (O(n))
