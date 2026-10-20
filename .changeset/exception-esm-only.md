---
"@httpx/exception": minor
---

ESM only (drop CJS).

CommonJS code can still load it with `require()` on node >= 22.12 (see [require(esm)](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require)), bun and bundlers. The package already requires node >= 22.14.

**Packaging changes**

- Dist files are now `.js` / `.d.ts` (were `.mjs` / `.cjs`, `.d.ts` / `.d.cts`), only reachable through the `exports` map.
- The `main`, `module`, `types` and `typesVersions` fields are removed: typescript projects still using `moduleResolution: "node"` (node10) can't resolve `@httpx/exception/serializer` and `@httpx/exception/experimental` types anymore, use `"bundler"`, `"node16"` or `"nodenext"`.
- Runtimes without `require(esm)` support (ie: jest in CJS mode) must use a dynamic `import()`.

Exceptions keep the same `Symbol.for("@httpx/exception-v4")` brand: `instanceof` and the typeguards still recognize exceptions created by a 4.0.0 copy, and the other way around.
