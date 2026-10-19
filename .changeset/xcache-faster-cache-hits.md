---
"@httpx/xcache": patch
---

Faster `runAsync()` / `runAsyncEntry()` cache hits (~+25%): the hit is resolved without awaiting an intermediate async function, and the result meta is built without object spreads.
