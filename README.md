## "do one thing" collection.

All packages are ESM only and built with tree-shaking in mind. CommonJS code can still load them with `require()` on Node 20.19+/22.12+ ([require(esm)](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require)), bun and bundlers.

### [@httpx/lru](https://github.com/belgattitude/httpx/tree/main/packages/lru#readme)

LRU cache optimized for performance and low memory usage. 2x-4x times faster on `get()` than [quick-lru](https://github.com/sindresorhus/quick-lru) without [memory overhead](https://github.com/sindresorhus/quick-lru?tab=readme-ov-file#trade-offs) and 6 times smaller than [lru-cache](https://github.com/isaacs/node-lru-cache). Less than 1Kb.

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/lru?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/lru)

### [@httpx/memo-intl](https://github.com/belgattitude/httpx/tree/main/packages/memo-intl#readme)

Speeds up Intl operations up to 50x. LRU-based memoizer for [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat),[Intl.DateFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and other Intl constructors. Less than 1kb.

[![npm](https://img.shields.io/npm/v/@httpx/memo-intl?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/memo-intl) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-memo-intl-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fmemo-intl) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/memo-intl?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/memo-intl)

### [@httpx/plain-object](https://github.com/belgattitude/httpx/tree/main/packages/plain-object#readme)

Fast and lightweight utility functions to check if a value is a plain object.

[![npm](https://img.shields.io/npm/v/@httpx/plain-object?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/plain-object) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-plain-object-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fplain-object) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/plain-object?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/plain-object)

### [@httpx/exception](https://github.com/belgattitude/httpx/tree/main/packages/exception#readme)

HTTP status errors with default message, instanceof, stack and nested error cause support. Lightweight, typical usage between [500b and 1300b](https://belgattitude.github.io/httpx/exception#bundle-size). Includes convenience typeguards, optional contextual info and a built-in serializer to cover cross-environments challenges (RSC, SSR...).

[![npm](https://img.shields.io/npm/v/@httpx/exception?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/exception) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/exception/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-exception-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fexception) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/exception/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/exception?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/exception)

### [@httpx/dsn-parser](https://github.com/belgattitude/httpx/tree/main/packages/dsn-parser#readme)

DSN & JDBC string parser with query params support in a light and modern package.

[![npm](https://img.shields.io/npm/v/@httpx/dsn-parser?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/dsn-parser) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/dsn-parser/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-dsn-parser-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fdsn-parser) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/dsn-parser/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/dsn-parser?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/dsn-parser)

### [@httpx/md5](https://github.com/belgattitude/httpx/tree/main/packages/md5#readme)

One of the fastest md5 hash function optimized for small strings (<8Kb). Less than 1.2Kb in browser usage. Automatically uses the native crypto module on node, bun for the best performance.

[![npm](https://img.shields.io/npm/v/@httpx/md5?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/md5) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/CHANGELOG.md) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/md5?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/md5)

### [@httpx/treeu](https://github.com/belgattitude/httpx/tree/main/packages/treeu#readme)

Fast and lightweight utilities to work with trees.

[![npm](https://img.shields.io/npm/v/@httpx/treeu?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/treeu) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-treeu-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Ftreeu) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/treeu?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/treeu)

### [@httpx/assert](https://github.com/belgattitude/httpx/tree/main/packages/assert#readme)

Lightweight assertions and typeguards starting at [~60b](https://github.com/belgattitude/httpx/tree/main/packages/assert#bundle-size).

[![npm](https://img.shields.io/npm/v/@httpx/assert?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/assert) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/assert/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-assert-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fassert) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/assert/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/assert?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/assert)

### [@httpx/stable-hash](https://github.com/belgattitude/httpx/tree/main/packages/stable-hash#readme)

Create keys or hashes from javascript values, useful for memoization or cache key generation.

[![npm](https://img.shields.io/npm/v/@httpx/stable-hash?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/stable-hash) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-stable-hash-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fstable-hash) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/stable-hash?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/stable-hash)

### [@httpx/compress](https://github.com/belgattitude/httpx/tree/main/packages/compress#readme)

String and Uint8Array compression utilities (gzip)

[![npm](https://img.shields.io/npm/v/@httpx/compress?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/compress) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-compress-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fcompress) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/compress?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/compress)

### [@httpx/encode](https://github.com/belgattitude/httpx/tree/main/packages/encode#readme)

Base encoding

[![npm](https://img.shields.io/npm/v/@httpx/encode?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/encode) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/encode/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-encode-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fencode) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/encode/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/encode?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/encode)

### [@httpx/barcode](https://github.com/belgattitude/httpx/tree/main/packages/barcode#readme)

Barcode utilities

[![npm](https://img.shields.io/npm/v/@httpx/barcode?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/barcode) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/barcode/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-barcode-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fbarcode) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/barcode/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/barcode?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/barcode)

### [@httpx/xcache](https://github.com/belgattitude/httpx/tree/main/packages/xcache#readme)

In-memory cache for async functions, with optional compression, statistics, deduplication and a hono integration.

[![npm](https://img.shields.io/npm/v/@httpx/xcache?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/xcache) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-xcache-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fxcache) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/xcache?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/xcache)

### [@httpx/hash](https://github.com/belgattitude/httpx/tree/main/packages/hash#readme)

Collection of hash functions, starting with a fast wasm-based xxhash64 implementation (~780B).

[![npm](https://img.shields.io/npm/v/@httpx/hash?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/hash) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/hash/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-hash-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fhash) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/hash/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/hash?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/hash)

### [@httpx/jwt-verify](https://github.com/belgattitude/httpx/tree/main/packages/jwt-verify#readme)

Verify JSON Web Tokens (JWT) with OIDC discovery support and payload validation through any [standard-schema](https://github.com/standard-schema/standard-schema) compatible library (zod, valibot...).

[![npm](https://img.shields.io/npm/v/@httpx/jwt-verify?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/jwt-verify) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/jwt-verify/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-jwt-verify-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fjwt-verify) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/jwt-verify/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/jwt-verify?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/jwt-verify)

### [@httpx/json-api](https://github.com/belgattitude/httpx/tree/main/packages/json-api#readme)

Basic typescript helpers to work with [json-api](https://jsonapi.org/).

[![npm](https://img.shields.io/npm/v/@httpx/json-api?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/json-api) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/json-api/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-json-api-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fjson-api) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/json-api/.size-limit.ts) [![downloads](https://img.shields.io/npm/dm/@httpx/json-api?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/json-api)

## Contributors

Contributions are welcome. Take a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) docs or skip and try

```bash
# make a fork and clone it, then
pnpm install
pnpm g:test-unit
pnpm g:lint
pnpm g:typecheck
```

## Support

Don't hesitate and open [an issue](https://github.com/belgattitude/httpx/issues).

## Sponsors

If my OSS work brightens your day, let's take it to new heights together! [Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>), or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
   </tr>
</table>

## License

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
