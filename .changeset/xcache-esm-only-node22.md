---
"@httpx/xcache": minor
---

ESM only (drop CJS) and require node >= 22.

Remove official support for the Vercel edge-runtime. It is still expected to work, but compatibility is not enforced on CI anymore (`test-unit-edge` removed).

Faster cache hits with compression, thanks to the faster base64 decoding of `@httpx/compress`:

| Runtime    | json + deflate | superjson + deflate | devalue + deflate |
| ---------- | -------------: | ------------------: | ----------------: |
| Node 24.21 |           1.9x |                2.0x |              2.2x |
| Node 26.10 |           2.2x |                2.1x |              2.1x |
| Bun 1.4.3  |           1.1x |                1.4x |              1.4x |

> `XMemCache.runAsync()` cache hits on a 46.7 MB payload (see `bench/x-mem-cache.bench.ts`).
