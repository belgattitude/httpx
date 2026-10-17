---
"@httpx/compress": minor
---

ESM only (drop CJS) and replace `uint8array-extras` by `@httpx/encode` for base64 encoding.

Base64 decoding is up to 3.5x faster, `@httpx/encode` picks the fastest implementation per runtime (native `Uint8Array.fromBase64()` / `toBase64()` or `Buffer`):

| Runtime    | `toEncodedString()` | `fromEncodedString()` |
| ---------- | ------------------: | --------------------: |
| Node 24.21 |           up to +7% |          3.1x to 3.5x |
| Node 26.10 |          +6% to +9% |          3.1x to 3.4x |
| Bun 1.4.3  |          +4% to +9% |          1.4x to 1.5x |

> Gzip and deflate, base64 and base64_urlsafe, on a 3.31 MB text compressed to 1.07 MB. Compression dominates `toEncodedString()`, the base64 gain shows on `fromEncodedString()`.
