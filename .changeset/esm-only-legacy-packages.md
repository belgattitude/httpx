---
"@httpx/dsn-parser": minor
"@httpx/plain-object": minor
"@httpx/stable-hash": minor
"@httpx/treeu": minor
---

ESM only (drop CJS build).

CommonJS code can still load the package with `require()` on Node 20.19+ / 22.12+ ([require(esm)](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require)), bun and bundlers.

Minimum node version raised to `>=20.19.0` (first 20.x release with unflagged `require(esm)`).
