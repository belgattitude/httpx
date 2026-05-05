---
"@httpx/plain-object": patch
---

Mention edge case for process.env

In bun and cloudflare workers, `isPlainObject(process.env)` returns `true`. 
In node, edge runtime and deno `isPlainObject(process.env)` returns `false`.