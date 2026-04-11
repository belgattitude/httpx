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
 RUN  v4.1.4 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 4318ms
     name                                           hz     min      max    mean     p75     p99    p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)        1,175.05  0.0821  23.1778  0.8510  1.4457  6.5121  8.6780  23.1778  ±14.28%      589
   · @httpx/lru.set() - compiled (dist)       1,799.95  0.0784  31.7102  0.5556  0.8049  3.3640  5.9146  31.7102  ±16.10%      900
   · @httpx/time-lru.set() - ts file (dev)    2,062.35  0.1259  27.7223  0.4849  0.3526  2.5203  3.8710  16.7191  ±15.69%     1035
   · @httpx/time-lru.set() - compiled (dist)  2,094.49  0.1247  17.1540  0.4774  0.2864  3.1822  7.1180  16.7256  ±14.63%     1048
   · quick-lru@7.3.0.set()                    8,905.67  0.0793  16.5620  0.1123  0.0968  0.2730  0.3948   4.4825   ±9.73%     4453
   · lru-cache@11.3.3.set()                   2,289.97  0.1136  20.1939  0.4367  0.4941  2.2460  6.7288  15.2900  ±13.62%     1145
   · lru-cache@11.3.3.set(/with ttl/)         3,695.37  0.1160  18.6887  0.2706  0.2004  1.7347  5.4360  16.0937  ±15.44%     1856

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3741ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        30,168.91  0.0266  0.5430  0.0331  0.0344  0.0860  0.1109  0.2084  ±0.75%    15085
   · @httpx/lru.get() - compiled (dist)       30,683.73  0.0268  0.7166  0.0326  0.0309  0.0897  0.1170  0.2570  ±0.87%    15342
   · @httpx/time-lru.get() - ts files (dev)   12,419.77  0.0576  1.1029  0.0805  0.0893  0.2157  0.2817  0.5182  ±1.21%     6210
   · @httpx/time-lru.get() - compiled (dist)  13,743.03  0.0581  0.6241  0.0728  0.0815  0.1652  0.2072  0.4652  ±0.88%     6872
   · quick-lru@7.3.0.get()                     4,326.30  0.1037  6.6405  0.2311  0.2668  1.0491  1.3541  3.1520  ±4.61%     2164
   · lru-cache@11.3.3.get()                   17,973.52  0.0318  6.9126  0.0556  0.0664  0.1576  0.1901  0.4403  ±3.74%     8987

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3113ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        27,175.32  0.0299  0.9546  0.0368  0.0389  0.0959  0.1307  0.2700  ±0.92%    13588
   · @httpx/lru.set() - compiled (dist)       29,332.81  0.0287  0.8213  0.0341  0.0311  0.0882  0.1136  0.2603  ±0.90%    14667
   · @httpx/time-lru.set() - compiled (dist)  13,867.36  0.0579  3.3996  0.0721  0.0784  0.1828  0.2395  0.4477  ±1.61%     6934
   · quick-lru@7.3.0.set()                    10,359.08  0.0475  7.7692  0.0965  0.0881  0.4080  0.5350  4.7785  ±6.90%     5180
   · lru-cache@11.3.3.set()                    9,410.83  0.0689  5.9828  0.1063  0.1100  0.2915  0.3955  0.7865  ±3.18%     4706

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2540ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   78,945.81  0.0085  1.2403  0.0127  0.0108  0.0397  0.0688  0.1498  ±1.01%    39473
   · @httpx/lru.peek() - compiled (dist)  80,282.39  0.0104  2.4150  0.0125  0.0108  0.0318  0.0509  0.1241  ±1.17%    40142
   · quick-lru@7.3.0.peek()               17,581.59  0.0475  1.1144  0.0569  0.0626  0.1323  0.1846  0.3347  ±0.91%     8791
   · lru-cache@11.3.3.peek()              28,485.41  0.0191  7.1274  0.0351  0.0394  0.1376  0.1700  0.3293  ±3.68%    14243

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2501ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   24,403.88  0.0201  5.4129  0.0410  0.0366  0.1810  0.2322  0.4927  ±4.90%    12202
   · @httpx/lru - forEach - compiled (dist)  29,713.74  0.0201  5.7892  0.0337  0.0332  0.1205  0.1579  0.4510  ±4.71%    14857
   · quick-lru@7.3.0 - forEach               12,066.81  0.0651  5.1362  0.0829  0.0792  0.1908  0.2577  0.4724  ±4.11%     6034
   · lru-cache@11.3.3 - forEach              17,142.82  0.0389  6.9446  0.0583  0.0603  0.1580  0.2302  0.5820  ±4.46%     8572

 BENCH  Summary
                                                                                                                                                                                    
  @httpx/lru.set() - compiled (dist) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.08x faster than @httpx/lru.set() - ts files (dev)
    2.12x faster than @httpx/time-lru.set() - compiled (dist)
    2.83x faster than quick-lru@7.3.0.set()
    3.12x faster than lru-cache@11.3.3.set()

  @httpx/lru.peek() - compiled (dist) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.02x faster than @httpx/lru.peek() - ts files (dev)
    2.82x faster than lru-cache@11.3.3.peek()
    4.57x faster than quick-lru@7.3.0.peek()

  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    2.41x faster than lru-cache@11.3.3.set(/with ttl/)
    3.89x faster than lru-cache@11.3.3.set()
    4.25x faster than @httpx/time-lru.set() - compiled (dist)
    4.32x faster than @httpx/time-lru.set() - ts file (dev)
    4.95x faster than @httpx/lru.set() - compiled (dist)
    7.58x faster than @httpx/lru.set() - ts files (dev)

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.22x faster than @httpx/lru - forEach - ts files (dev)
    1.73x faster than lru-cache@11.3.3 - forEach
    2.46x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.get() - compiled (dist) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.02x faster than @httpx/lru.get() - ts files (dev)
    1.71x faster than lru-cache@11.3.3.get()
    2.23x faster than @httpx/time-lru.get() - compiled (dist)
    2.47x faster than @httpx/time-lru.get() - ts files (dev)
    7.09x faster than quick-lru@7.3.0.get()

```

### Bun 1.3.12

```
 RUN  v4.1.4 /home/sebastien/github/httpx/packages/plain-object

 ✓ bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values 7742ms
     name                                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · "@httpx/plain-object": `isPlainObject(v)`            3,068,133.07  0.0002  1.0000  0.0003  0.0003  0.0006  0.0007  0.0016  ±0.84%  1534067
   · "is-plain-obj":"4.1.0": 'isPlainObj(v)'              3,021,500.93  0.0003  1.0634  0.0003  0.0003  0.0006  0.0007  0.0011  ±0.82%  1510751
   · "@sindresorhus/is":"8.0.0": 'is.plainObject(v)'      1,728,034.46  0.0004  2.0252  0.0006  0.0005  0.0009  0.0011  0.0032  ±1.00%   864018
   · "es-toolkit":"1.45.1": 'isPlainObject(v)'            1,022,275.89  0.0008  1.7334  0.0010  0.0008  0.0018  0.0022  0.0144  ±1.10%   511138
   · "redux":"5.0.1": 'isPlainObject(v)'                  1,430,576.48  0.0005  1.5664  0.0007  0.0006  0.0012  0.0014  0.0060  ±0.82%   715289
   · "is-plain-object":"5.0.0": 'isPlainObject(v)'          501,447.54  0.0014  4.3306  0.0020  0.0018  0.0043  0.0059  0.0285  ±3.94%   250724
   · "immer/is-plain-object":"4.2.0": 'isPlainObject(v)'  1,120,115.77  0.0007  0.8322  0.0009  0.0007  0.0015  0.0018  0.0151  ±0.87%   560101
   · lodash-es:"4.18.1": '_.isPlainObject(v)'                33,581.59  0.0072  4.1610  0.0298  0.0349  0.1210  0.1850  0.5121  ±2.54%    16791

 BENCH  Summary
                                                                                                                                                                                    
  "@httpx/plain-object": `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
    1.02x faster than "is-plain-obj":"4.1.0": 'isPlainObj(v)'
    1.78x faster than "@sindresorhus/is":"8.0.0": 'is.plainObject(v)'
    2.14x faster than "redux":"5.0.1": 'isPlainObject(v)'
    2.74x faster than "immer/is-plain-object":"4.2.0": 'isPlainObject(v)'
    3.00x faster than "es-toolkit":"1.45.1": 'isPlainObject(v)'
    6.12x faster than "is-plain-object":"5.0.0": 'isPlainObject(v)'
    91.36x faster than lodash-es:"4.18.1": '_.isPlainObject(v)'

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
