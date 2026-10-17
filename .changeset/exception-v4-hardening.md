---
"@httpx/exception": major
---

Harden deserialization and typeguards, require node >= 22.14.

See the [UPGRADE.md](https://github.com/belgattitude/httpx/blob/main/packages/exception/UPGRADE.md) for details.

**Breaking changes**

- Requires node >= 22.14 (node 20 has reached end-of-life), dist files target `node22` / `es2022`.
- `isHttpException`, `isHttpClientException` and `isHttpServerException` now require a numeric `statusCode`, even when `checkStatusCode` is `false` (ie: `new HttpException("404")` is not an http exception anymore).
- `fromJson` never throws: unexpected payloads (ie: `null`, a number, an unknown `__type`, an invalid `cause`) now return a `SerializerError` instead of throwing a `TypeError` or an `Error`.
- `createFromSerializable` throws a `SerializerError` (instead of an `Error` or a `TypeError`) on unexpected payloads.
- Nested error causes deeper than 10 levels are dropped when (de-)serializing (prevents stack overflows on crafted payloads or cyclic causes).

**Fixes**

- Unserializing an error named after an inherited object key (ie: `constructor`, `toString`, `__proto__`) now falls back to `Error` (was returning a `String` object or throwing a `TypeError`).
