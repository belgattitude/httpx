# @httpx/stable-hash

Create keys or hashes from javascript values, useful for memoization or cache key generation.

[![npm](https://img.shields.io/npm/v/@httpx/stable-hash?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/stable-hash)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-stable-hash-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fstable-hash)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/stable-hash@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/stable-hash@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/stable-hash?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/stable-hash)
[![license](https://img.shields.io/npm/l/@httpx/stable-hash?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/stable-hash
$ yarn add @httpx/stable-hash
$ pnpm add @httpx/stable-hash
```

## Features

- 👉&nbsp; Works with plain objects, dates, bigint, number, null, undefined and arrays.
- 🦄&nbsp; Insensitive to object keys or array parameters order.
- 🙏&nbsp; Properly error if it encounters an unsupported datatype.
- 📐&nbsp; Lightweight (starts at [~500B](#bundle-size)).
- 🛡️&nbsp; Tested on [node 20-24, bun, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/stable-hash) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/stable-hash#readme)

## Usage

- [x] [createStableKey](#createStableKey) - Create a stable key from a value as a string (result object)
- [x] [createStableKeyOrThrow](#createstablekeyorthrow) - Create a stable key from value a string (throws).
- [x] [createStableHash](#createStableHash) - Create a stable hash from a javascript object as a SHA-256/hexa (result object)
- [x] [createStableHashOrThrow](#createStableHashOrThrow) - Create a stable hash from a javascript object as a SHA-256/hexa (throws)

### createStableKey

```typescript
import { createStableKey } from '@httpx/stable-hash'

const params = {
  key8: 'a string',
  key1: 1,
  key3: true,
  key2: [3, 2, 1],
  key7: {
    key2: true,
    key1: new Date('2025-02-11T08:58:32.075Z'),
  },
};

const result = createStableKey(params);

if (!result.success) {
  throw result.error; // TypeError
}

const key = result.key;

// Key contains a json comptatible string with object keys sorted.
// By default it will sort arrays if they contains only strings or numbers
// including bigints.

// "{"key1":1,"key2":[1,2,3],"key3":true,"key7":{"key1":"2025-02-11T08:58:32.075Z","key2":true},"key8":"a string"}"
```

### createStableKeyOrThrow

```typescript
import { createStableKeyOrThrow } from '@httpx/stable-hash'

const params = {
  key8: 'a string',
  key1: 1,
  key3: true,
  key2: [3, 2, 1],
  key7: {
    key2: true,
    key1: new Date('2025-02-11T08:58:32.075Z'),
  },
};

const key = createStableKeyOrThrow(params);

// Key contains a json comptatible string with object keys sorted.
// By default it will sort arrays if they contains only strings or numbers
// including bigints.

// "{"key1":1,"key2":[1,2,3],"key3":true,"key7":{"key1":"2025-02-11T08:58:32.075Z","key2":true},"key8":"a string"}"
```

### createStableHash

```typescript
import { createStableHash } from '@httpx/stable-hash';

const value = {
  key8: 'a string',
  key1: 1,
  key3: true,
  key2: [3, 2, 1],
  key7: {
    key2: true,
    key1: new Date('2025-02-11T08:58:32.075Z'),
  },
};

const result = await createStableHash(value, {
  // By default SHA-256 is used (SHA-512 available)
  algorithm: 'SHA-256',
  // By default the hash is encoded in hexadecimal
  encoding: 'hexa',
});
if (!result.success) {
  throw result.error;
}
const hash = result.hash;
// -> 'fb17a6300efcf62ae80708e2a672aee581b7f0dd7c6a9a7a748218846c679394'
```

### createStableHashOrThrow

```typescript
import { createStableHashOrThrow } from '@httpx/stable-hash';

const params = {
  key8: 'a string',
  key1: 1,
  key3: true,
  key2: [3, 2, 1],
  key7: {
    key2: true,
    key1: new Date('2025-02-11T08:58:32.075Z'),
  },
};

try {
  const hash = await createStableHashOrThrow(params, {
    // By default SHA-256 is used (SHA-512 available)
    algorithm: 'SHA-256',
    // By default the hash is encoded in hexadecimal
    encoding: 'hexa',
  });
  // -> 'fb17a6300efcf62ae80708e2a672aee581b7f0dd7c6a9a7a748218846c679394'
} catch (e) {
  // TypeError in case of an unserializable data type
}
```

## Alternatives

- [x] [stable-hash](https://github.com/shuding/stable-hash). Fastest alternative. Might swallow errors though.

## Benchmarks

Performance is monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx).

[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)


See [bench](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/bench) for details. 


## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/.size-limit.ts)

| Scenario                                                      | Size with deps (compressed) |
|---------------------------------------------------------------|----------------------------:|
| `import { createStableKeyOrThrow } from '@httpx/stable-hash'  |                      ~ 480B |
| `import { createStableKey } from '@httpx/stable-hash'         |                      ~ 520B |
| `import { createStableHashOrThrow } from '@httpx/stable-hash' |                      ~ 650B |
| `import { createStableHash } from '@httpx/stable-hash'        |                      ~ 695B |


## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                      |
|--------------|----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                    |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                              |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                               | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                                 | 
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                                    |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                     |
| Performance  | ✅  | Monitored with with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                        |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
RUN  v4.1.4 /home/sebastien/github/httpx/packages/stable-hash


 ✓ bench/compare.bench.ts > Comparison 11116ms
     name                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/stable-hash                 217,237.08  0.0027  2.5960  0.0046  0.0049  0.0151  0.0361  0.0953  ±1.94%   108619
   · stable-hash                     11,912,066.78  0.0001  0.6124  0.0001  0.0001  0.0001  0.0002  0.0004  ±0.65%  5956034
   · stable-hash-x                   11,986,257.33  0.0001  1.1343  0.0001  0.0001  0.0001  0.0002  0.0004  ±0.90%  5993129
   · @tanstack/query-core (hashKey)     262,568.87  0.0028  4.1629  0.0038  0.0033  0.0090  0.0159  0.0622  ±1.95%   131285

 ✓ bench/create-stable-hash.bench.ts > createStableHashOrThrow 1227ms
     name                                                 hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · createStableHashOrThrow with array sorting     4,046.46  0.1254  10.4688  0.2471  0.2565  0.4820  0.6053  1.1734  ±5.03%     2024
   · createStableHashOrThrow without array sorting  4,582.62  0.1261   1.5195  0.2182  0.2289  0.4637  0.5229  0.9285  ±1.22%     2292

 ✓ bench/create-stable-key.bench.ts > createStableKeyOrThrow 1445ms
     name                                                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · createStableKeyOrThrow with array sorting     179,073.50  0.0038  7.9348  0.0056  0.0053  0.0145  0.0325  0.0869  ±3.27%    89537
   · createStableKeyOrThrow without array sorting  273,073.08  0.0028  1.2681  0.0037  0.0035  0.0081  0.0147  0.0568  ±1.08%   136537

 BENCH  Summary

  stable-hash-x - bench/compare.bench.ts > Comparison
    1.01x faster than stable-hash
    45.65x faster than @tanstack/query-core (hashKey)
    55.18x faster than @httpx/stable-hash

  createStableHashOrThrow without array sorting - bench/create-stable-hash.bench.ts > createStableHashOrThrow
    1.13x faster than createStableHashOrThrow with array sorting

  createStableKeyOrThrow without array sorting - bench/create-stable-key.bench.ts > createStableKeyOrThrow
    1.52x faster than createStableKeyOrThrow with array sorting
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/bench) for details.


## Contributors

Contributions are warmly appreciated. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

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
