# @httpx/plain-object

[Fast](#benchmarks) and lightweight ([~80B](#bundle-size)) functions to check or assert
that a value is a plain object.

A plain object is a basic JavaScript object, such as `{}`, `{ data: [] }`, `new Object()` or `Object.create(null)`.

See how it [compares to other libraries](#comparison-with-other-libraries).

[![npm](https://img.shields.io/npm/v/@httpx/plain-object?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/plain-object)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-plain-object-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fplain-object)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/plain-object@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/plain-object@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/plain-object?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/plain-object)
[![license](https://img.shields.io/npm/l/@httpx/plain-object?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/plain-object
$ yarn add @httpx/plain-object
$ pnpm add @httpx/plain-object
```

## Features

- 👉&nbsp; Provide [isPlainObject](#isplainobject) and [assertPlainObject](#assertplainobject) functions.
- 🦄&nbsp; Convenience [PlainObject](#plainobject-type) typescript typings.
- 🚀&nbsp; Faster than most alternatives, see [benchmarks](#benchmarks).
- 📐&nbsp; Lightweight (starts at [~80B](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-25, bun, browser, cloudflare workers and runtime/edge](#compatibility).
- 🙏&nbsp; Works cross-realms (node:vm runInNewContext,...)
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/plain-object) or [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/plain-object#readme)

## Usage

### isPlainObject

```typescript
import { isPlainObject } from "@httpx/plain-object";

// ✅👇 True
isPlainObject({}); // ✅
isPlainObject({ key: "value" }); // ✅
isPlainObject({ key: new Date() }); // ✅
isPlainObject(new Object()); // ✅
isPlainObject(Object.create(null)); // ✅
isPlainObject({ nested: { key: true } }); // ✅
isPlainObject(new Proxy({}, {})); // ✅
isPlainObject({ [Symbol("tag")]: "A" }); // ✅

// ✅👇 (node context, workers, ...)
const runInNewContext = await import("node:vm").then(
  (mod) => mod.runInNewContext
);
isPlainObject(runInNewContext("({})")); // ✅

// ❌👇 False

class Test {}
isPlainObject(new Test()); // ❌
isPlainObject(10); // ❌
isPlainObject(null); // ❌
isPlainObject("hello"); // ❌
isPlainObject([]); // ❌
isPlainObject(new Date()); // ❌
isPlainObject(new Uint8Array([1])); // ❌
isPlainObject(Buffer.from("ABC")); // ❌
isPlainObject(Promise.resolve({})); // ❌
isPlainObject(Object.create({})); // ❌
isPlainObject(new (class Cls {})()); // ❌

// ⚠️ Edge cases
//
// 👇 globalThis isn't properly portable across all JS environments
//

isPlainObject(globalThis); // ✅ with Bun ❌ otherwise (browser, Nodejs, edge, cloudflare)

// 👇 Static built-in classes aren't properly checked. This is a trade-off
//    to maintain the best performance and size. If you need to check for these,
//    use a custom type guard. But in most cases, you won't need to check for these
//    as the probability of writing a code that receives these as plain objects is low.
//    and probably indicates an issue in your code.

isPlainObject(Math); // ⚠️✅ return true, but Math is not a plain object
isPlainObject(JSON); // ⚠️✅ return true, but JSON is not a plain object
isPlainObject(Atomics); // ⚠️✅ return true, but Atomics is not a plain object
isPlainObject(Reflect); // ⚠️✅ return true, but Reflect is not a plain object
```

### assertPlainObject

```typescript
import { assertPlainObject } from "@httpx/plain-object";
import type { PlainObject } from "@httpx/plain-object";

function fn(value: unknown) {
  // 👇 Throws `new TypeError('Not a PlainObject')` if not a plain object
  assertPlainObject(value);

  // 👇 Throws `new TypeError('Custom message')` if not a plain object
  assertPlainObject(value, "Custom message");

  // 👇 Throws custom error if not a plain object
  assertPlainObject(value, () => {
    throw new HttpBadRequest("Custom message");
  });

  return value;
}

try {
  const value = fn({ key: "value" });
  // ✅ Value is known to be PlainObject<unknown>
  assertType<PlainObject>(value);
} catch (error) {
  console.error(error);
}
```

### PlainObject type

#### Generic

`ìsPlainObject` and `assertPlainObject` accepts a generic to provide type
autocompletion. Be aware that no runtime check are done. If you're looking for
runtime validation, check zod, valibot or other alternatives.

```typescript
import { isPlainObject } from "@httpx/plain-object";
import type { PlainObject } from "@httpx/plain-object";

type CustomType = {
  id: number;
  data?: {
    test: string[];
    attributes?: {
      url?: string | null;
      caption?: string | null;
      alternativeText?: string | null;
    } | null;
  } | null;
};

const value = { id: 1 } as unknown;

if (isPlainObject<CustomType>(value)) {
  // ✅ Value is a PlainObject with typescript autocompletion
  // Note that there's no runtime checking of keys, so they are
  // `unknown | undefined`. They will require unsing `?.` to access.

  const url = value?.data?.attributes?.url; // autocompletion works
  // ✅ url is `unknown | undefined`, so in order to use it, you'll need to
  //    manually check for the type.
  if (typeof url === "string") {
    console.log(url.toUpperCase());
  }
}
```

#### PlainObject

```typescript
import { assertPlainObject } from "@httpx/plain-object";
import type { PlainObject } from "@httpx/plain-object";

function someFn(value: PlainObject) {
  //
}

const value = { key: "value" } as unknown;
assertPlainObject(value);
someFn(value);
```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

### NodeJs 24.x

```
 RUN  v4.1.0 /home/sebastien/github/httpx/packages/plain-object


 ✓ bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values 6714ms
     name                                                           hz     min      max    mean     p75     p99    p995    p999      rme  samples
   · "@httpx/plain-object": `isPlainObject(v)`            1,167,837.33  0.0007   0.8963  0.0009  0.0008  0.0015  0.0018  0.0090   ±1.00%   583919
   · "is-plain-obj":"4.1.0": 'isPlainObj(v)'              1,047,345.27  0.0008   8.3108  0.0010  0.0008  0.0016  0.0020  0.0150   ±3.48%   523673
   · "@sindresorhus/is":"7.2.0": 'is.plainObject(v)'      1,062,605.89  0.0008   1.1887  0.0009  0.0008  0.0018  0.0021  0.0127   ±0.92%   531303
   · "es-toolkit":"1.45.1": 'isPlainObject(v)'              800,068.53  0.0009  22.2441  0.0012  0.0010  0.0022  0.0025  0.0167  ±10.58%   400035
   · "redux":"5.0.1": 'isPlainObject(v)'                    329,692.81  0.0024   1.5117  0.0030  0.0028  0.0052  0.0065  0.0311   ±1.13%   164847
   · "is-plain-object":"5.0.0": 'isPlainObject(v)'          511,111.59  0.0016   1.6956  0.0020  0.0017  0.0041  0.0047  0.0257   ±1.40%   255556
   · "immer/is-plain-object":"4.2.0": 'isPlainObject(v)'    351,237.13  0.0020   3.4495  0.0028  0.0032  0.0052  0.0092  0.0623   ±2.24%   175627
   · lodash-es:"4.17.23": '_.isPlainObject(v)'               12,394.91  0.0515   1.1758  0.0807  0.0894  0.2915  0.4332  0.8713   ±1.85%     6198

 BENCH  Summary

  "@httpx/plain-object": `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
    1.10x faster than "@sindresorhus/is":"7.2.0": 'is.plainObject(v)'
    1.12x faster than "is-plain-obj":"4.1.0": 'isPlainObj(v)'
    1.46x faster than "es-toolkit":"1.45.1": 'isPlainObject(v)'
    2.28x faster than "is-plain-object":"5.0.0": 'isPlainObject(v)'
    3.32x faster than "immer/is-plain-object":"4.2.0": 'isPlainObject(v)'
    3.54x faster than "redux":"5.0.1": 'isPlainObject(v)'
    94.22x faster than lodash-es:"4.17.23": '_.isPlainObject(v)'
```

### Bun 1.3

```

 RUN  v4.1.0 /home/sebastien/github/httpx/packages/plain-object


 ✓ bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values 8801ms
     name                                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · "@httpx/plain-object": `isPlainObject(v)`            3,031,245.38  0.0003  1.1474  0.0003  0.0003  0.0005  0.0007  0.0008  ±0.87%  1515623
   · "is-plain-obj":"4.1.0": 'isPlainObj(v)'              2,549,208.34  0.0003  1.5657  0.0004  0.0003  0.0007  0.0008  0.0010  ±0.84%  1274605
   · "@sindresorhus/is":"7.2.0": 'is.plainObject(v)'      2,331,887.24  0.0003  9.4652  0.0004  0.0005  0.0008  0.0008  0.0019  ±4.52%  1165944
   · "es-toolkit":"1.45.1": 'isPlainObject(v)'            1,001,717.61  0.0008  1.6459  0.0010  0.0009  0.0020  0.0022  0.0158  ±1.17%   500859
   · "redux":"5.0.1": 'isPlainObject(v)'                  1,300,233.22  0.0006  1.5704  0.0008  0.0007  0.0012  0.0014  0.0049  ±0.92%   650117
   · "is-plain-object":"5.0.0": 'isPlainObject(v)'          517,269.60  0.0015  7.0468  0.0019  0.0016  0.0033  0.0043  0.0270  ±4.92%   258635
   · "immer/is-plain-object":"4.2.0": 'isPlainObject(v)'  1,117,577.40  0.0008  1.1199  0.0009  0.0008  0.0015  0.0016  0.0138  ±0.73%   558789
   · lodash-es:"4.17.23": '_.isPlainObject(v)'               26,383.39  0.0083  4.4473  0.0379  0.0424  0.1492  0.1926  0.4897  ±2.96%    13206

 BENCH  Summary

  "@httpx/plain-object": `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
    1.19x faster than "is-plain-obj":"4.1.0": 'isPlainObj(v)'
    1.30x faster than "@sindresorhus/is":"7.2.0": 'is.plainObject(v)'
    2.33x faster than "redux":"5.0.1": 'isPlainObject(v)'
    2.71x faster than "immer/is-plain-object":"4.2.0": 'isPlainObject(v)'
    3.03x faster than "es-toolkit":"1.45.1": 'isPlainObject(v)'
    5.86x faster than "is-plain-object":"5.0.0": 'isPlainObject(v)'
    114.89x faster than lodash-es:"4.17.23": '_.isPlainObject(v)'
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.size-limit.ts)

| Scenario (esm)                                           | Size (compressed) |
| -------------------------------------------------------- | ----------------: |
| `import { isPlainObject } from '@httpx/plain-object`     |             ~ 80B |
| `import { assertPlainObject } from '@httpx/plain-object` |            ~ 133B |
| `Both isPlainObject and assertPlainObject`               |            ~ 141B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/plain-object@latest).

## Compatibility

| Level        | CI  | Description                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                     |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                                  |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                                |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                                  |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                                     |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                      |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                              |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

| Library                                                                | Compat      | Perf          | CJS+ESM |
| ---------------------------------------------------------------------- | ----------- | ------------- | ------- |
| [is-plain-obj](https://github.com/sindresorhus/is-plain-obj)           | Differences | 1.17x slower  | No      |
| [es-toolkit](https://github.com/toss/es-toolkit)                       | No          | 1.25x slower  | Yes     |
| (@redux)[isPlainObject](https://github.com/reduxjs/redux)              | ✅ 100%     | 2.76x slower  | Yes     |
| (lodash)[isPlainObject](https://lodash.com/docs/4.17.15#isPlainObject) | No          | 83.50x slower | No      |

### redux/isPlainObject

100% compatible see tests.

### @sindresorhus/is-plain-obj

This library wouldn't be possible without [@sindresorhus](https://github.com/sindresorhus) [is-plain-obj](https://github.com/sindresorhus/is-plain-obj).
Notable differences:

- [x] Slightly faster (10%) and lighter
- [x] ESM and CJS formats.
- [x] Named export.
- [x] Smaller bundle size.
- [x] Provide a `PlainObject` type and `assertPlainObject` function.
- [x] Typescript convenience `PlainObject` type.

Since v2, it diverges from `is-plain-obj` by

- [x] Static built-in classes are considered as plain objects (use [isStaticBuiltInClass](#isstaticbuiltinclass) to exclude).
- [x] `[Symbol.iterator]` is considered as a valid property for plain objects.
- [x] `[Symbol.toStringTag]` is considered as a valid property for plain objects.`

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
