---
"@httpx/xcache": minor
---

Add the `lru.maxTTL` option to cap the time to live of all the entries (`defaultTTL` and `runAsync({ ttl })`), ie: a very short cache in development while still creating the entries (serializer, compressor). Returned by `getConfig()`.
