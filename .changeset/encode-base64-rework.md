---
"@httpx/encode": minor
---

Rework base64: fastest implementation per runtime, native compatible options, `fromUint8Array()` / `toUint8Array()`

- `Base64` picks the fastest implementation for the runtime: native `Uint8Array.fromBase64()` / `toBase64()` (node 25+, bun, deno, recent browsers), `Buffer` (node 22-24), optimized js encode and `atob()` decode otherwise.
- New `fromUint8Array()` / `toUint8Array()` for binary data, `toUint8Array()` returns a `Uint8Array<ArrayBuffer>` (never a pooled `Buffer`).
- New options, same as `Uint8Array.fromBase64()` / `toBase64()`: `alphabet` and `omitPadding` when encoding, `alphabet` and `lastChunkHandling` when decoding. New `fatal` option for `decode()` to throw on invalid utf-8.
- Fix: a leading BOM (U+FEFF) is now preserved when decoding.
- Faster pure js and `atob()` implementations (up to 15x on decode).

Breaking changes:

- Invalid input now throws an `Invalid Base64 input` error on every implementation (ie: node's `Buffer` used to silently return corrupted data).
- `@httpx/encode/base64/base64.browser` renamed to `@httpx/encode/base64/base64.atob` (`Base64Browser` -> `Base64Atob`).
- `@httpx/encode/base64/base64.nodejs` renamed to `@httpx/encode/base64/base64.node20` (`Base64NodeJs` -> `Base64Node20`).
- Minimum TypeScript version is 5.7.
