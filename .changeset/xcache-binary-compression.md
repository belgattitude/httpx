---
"@httpx/xcache": minor
---

Performance improvements for `XMemCache` and `CacheCompress`.

- Faster cache key generation (~40% faster), `runAsync` cache hits are ~25% faster. Generated keys are unchanged.
- `CacheCompress` now stores the compressed data as a `Uint8Array` by default (new `encoding: "binary"` option), saving ~25% memory and the base64 encoding/decoding cost. Use `encoding: "base64"` or `"base64_urlsafe"` to keep the previous string output.

**Breaking (types)**: `CacheCompressResult.data` on success is now `string | Uint8Array`.
