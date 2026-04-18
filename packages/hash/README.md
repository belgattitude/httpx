# @httpx/hash

[![npm](https://img.shields.io/npm/v/@httpx/hash?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/hash)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/hash/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-hash-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fhash)
[![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/hash/.size-limit.ts)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/hash?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/hash)
[![license](https://img.shields.io/npm/l/@httpx/hash?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/hash
$ yarn add @httpx/hash
$ pnpm add @httpx/hash
```

## Features

- 🖖&nbsp; Provides xxhash64 implementation at the moment.
- 🚀&nbsp; Uses wasm implementation of xxhash64.
- 📐&nbsp; Lightweight (starts at [~780B](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-24, bun, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM.

## Documentation

### XXHash64 (wasm)

The [XXHash](https://github.com/Cyan4973/xxHash) is a very fast non-cryptographic hash algorithm that offers a low collision rate.

The XXHash64 variant produces a 64-bit hash suitable for checksums, hash tables and databases.

- [x] Extremely fast.
- [x] Low collision rate.
- [x] 64-bit output (bigint, signed64).
- [x] Passes [SMHasher](https://github.com/rurban/smhasher) tests.
- [ ] Doesn't fully pass [SMHasher3](https://gitlab.com/fwojcik/smhasher3) tests


> Check [SMHasher](https://github.com/rurban/smhasher) and [SMHasher3](https://gitlab.com/fwojcik/smhasher3/-/blob/main/results/README.md#passing-hashes)
> for more details about quality of hash functions.

#### Usage

For most projects, you can benefit from top-level await by creating a file named `xxHash64.ts`.
The file will initialize the wasm module and export the hasher instance without async calls in
the rest of your code.

```typescript
import { createXXHash64 } from '@httpx/hash/xxhash-wasm';

// Notice the top-level await as wasm loading is async.
const xxHash64 = await createXXHash64({
  // Optionally provide a seed (default is 0n)
  // For example, Spark uses 42 as a default seed
  defaultSeed: 0n,
});

```

Use it as follows:

```typescript
import { xxHash64 } from './xxHash64';

// Javascript Bigint output as 64-bit unsigned integer
const hashedBigint = xxHash64.toBigint('some input string');

// Javascript Bigint output as 64-bit signed integer
// Same as `BigInt.asIntN(64, xxHash64.toBigint('some input string'))`
const hashedSigned64 = xxHash64.toSigned64('some input string');
```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
 RUN  v4.1.4 /home/sebastien/github/httpx/packages/hash


 ✓ bench/compare/xxhash.bench.ts > xxHash64 2525ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · toBigint    1,522,043.01  0.0005  8.8832  0.0007  0.0006  0.0010  0.0016  0.0095  ±3.54%   761022
   · toSigned64  1,242,367.77  0.0006  1.4564  0.0008  0.0007  0.0020  0.0023  0.0152  ±1.13%   621184

 BENCH  Summary

  toBigint - bench/compare/xxhash.bench.ts > xxHash64
    1.23x faster than toSigned64
 
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/hash/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/hash/.size-limit.ts)

| Scenario (esm)                                             | Size (compressed) |
|------------------------------------------------------------|------------------:|
| `import { createXXHash64 } from '@httpx/hash/xxhash-wasm'` |        ~ 765B (*) |

(*) Add [2.3KB gzipped](https://github.com/jungomi/xxhash-wasm?tab=readme-ov-file#bundle-size) for the wasm file.

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                              |
|--------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅   | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                            |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/hash/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                       | 
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                              |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                         |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                            |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                             |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                     |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together!
[Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>),
or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
    <td>
      <a href="https://www.embie.be/?ref=belgattitude" target="_blank">
        <img width="65" src="https://avatars.githubusercontent.com/u/98402122?s=200&v=4" alt="Jetbrains logo" />    
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
    <td align="center">
      <a href="https://www.embie.be/?ref=belgattitude" target="_blank">Embie.be</a>
    </td>
   </tr>
</table>

## License

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.

