---
"@httpx/json-api": minor
---

ESM only (drop CJS) and require node >= 22.14.

CommonJS code can still load it with `require()` (see [require(esm)](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require)), bun and bundlers. The `main`, `module` and `types` fields are removed, the package is only reachable through its `exports` map.
