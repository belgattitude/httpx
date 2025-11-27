---
"@httpx/plain-object": patch
"@httpx/assert": patch
---

Mention bun difference for isPlainObject(globalThis)


In Bun (tested with 1.3.3), isPlainObject(globalThis) returns true, while in Node.js, edge, cloudflare and browsers it returns false. 