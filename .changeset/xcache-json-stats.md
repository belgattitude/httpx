---
"@httpx/xcache": patch
---

`getStats()`, `getEntryInfo()` and `getConfig()` omit undefined values reported by custom compressors (meta and config), so they're always JSON serializable.
