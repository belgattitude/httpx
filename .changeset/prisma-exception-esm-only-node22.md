---
"prisma-exception": minor
---

ESM only (drop CJS) and require node >= 22.14.

CommonJS code can still load it with `require()` (see [require(esm)](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require)), bun and bundlers. Dist files are now `.js` / `.d.ts` (were `.mjs` / `.cjs`), only reachable through the `exports` map.
