# @httpx/plain-object

[Fast](#benchmarks) and lightweight ([~80B](#bundle-size)) functions to check or assert
that a value is a plain object. 

A plain object is a basic JavaScript object, such as `{}`, `{ data: [] }`, `new Object()` or `Object.create(null)`.

See how it [compares to other libraries](#comparison-with-other-libraries).

[![npm](https://img.shields.io/npm/v/@httpx/plain-object?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/plain-object)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-plain-object-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fplain-object)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
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
- 🛡️&nbsp; Tested on [node 18-22, browser, cloudflare workers and runtime/edge](#compatibility).
- 🙏&nbsp; Cross-realms tolerant (node:vm runInNewContext,...)
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/plain-object) or [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/plain-object#readme)

## Usage

### isPlainObject

```typescript
import { isPlainObject } from '@httpx/plain-object';

// ✅👇 True
isPlainObject({ });                       // ✅
isPlainObject({ key: 'value' });          // ✅
isPlainObject({ key: new Date() });       // ✅
isPlainObject(new Object());              // ✅
isPlainObject(Object.create(null));       // ✅
isPlainObject({ nested: { key: true} });  // ✅
isPlainObject(new Proxy({}, {}));         // ✅
isPlainObject({ [Symbol('tag')]: 'A' });  // ✅

// ✅👇 (node context, workers, ...)
const runInNewContext = await import('node:vm').then(
    (mod) => mod.runInNewContext
);
isPlainObject(runInNewContext('({})'));   // ✅

// ✅👇 Static built-in classes are treated as plain objects
//       check for `isStaticBuiltInClass` to exclude if needed

isPlainObject(Math);                // ✅
isPlainObject(JSON);                // ✅
isPlainObject(Atomics);             // ✅

// ❌👇 False

class Test { };
isPlainObject(new Test())           // ❌
isPlainObject(10);                  // ❌
isPlainObject(null);                // ❌
isPlainObject('hello');             // ❌
isPlainObject([]);                  // ❌
isPlainObject(new Date());          // ❌
isPlainObject(new Uint8Array([1])); // ❌
isPlainObject(Buffer.from('ABC'));  // ❌
isPlainObject(Promise.resolve({})); // ❌
isPlainObject(Object.create({}));   // ❌
isPlainObject(new (class Cls {}));  // ❌
isPlainObject(globalThis);          // ❌,
```

### assertPlainObject

```typescript
import { assertPlainObject } from '@httpx/plain-object';
import type { PlainObject } from '@httpx/plain-object';

function fn(value: unknown) {

    // 👇 Throws `new TypeError('Not a PlainObject')` if not a plain object
    assertPlainObject(value);

    // 👇 Throws `new TypeError('Custom message')` if not a plain object
    assertPlainObject(value, 'Custom message');

    // 👇 Throws custom error if not a plain object
    assertPlainObject(value, () => {
        throw new HttpBadRequest('Custom message');
    });
    
    return value;
}

try {
    const value = fn({ key: 'value' });
    // ✅ Value is known to be PlainObject<unknown>
    assertType<PlainObject>(value);
} catch (error) {
    console.error(error);
}
```

### isStaticBuiltInClass

> info: Since v2.0.0

Since v2.0.0, `isPlainObject` will accept static built-in classes 
as plain objects (Math, JSON, Atomics). If you need to exclude them,
a new typeguard has been created `isStaticBuiltInClass`.

```typescript
import { isPlainObject, isStaticBuiltInClass } from '@httpx/plain-object';
const v = Math; // or Atomics or JSON
if (isPlainObject(v) && !isStaticBuiltInClass(v)) {
    console.log('v is a plain object but not a static built-in class');
}
```
### PlainObject type

#### Generic

`ìsPlainObject` and `assertPlainObject` accepts a generic to provide type 
autocompletion. Be aware that no runtime check are done. If you're looking for 
runtime validation, check zod, valibot or other alternatives.

```typescript
import { isPlainObject } from '@httpx/plain-object';
import type { PlainObject } from '@httpx/plain-object';

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
  if (typeof url === 'string') {
      console.log(url.toUpperCase());
  }
}
```

#### PlainObject

```typescript
import { assertPlainObject } from '@httpx/plain-object';
import type { PlainObject } from '@httpx/plain-object';

function someFn(value: PlainObject) {
  //    
}

const value = { key: 'value' } as unknown;
assertPlainObject(value);
someFn(value)
```
## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
RUN  v2.1.8

 ✓ bench/comparative.bench.ts (7) 5774ms
   ✓ Compare calling isPlainObject with 110x mixed types values (7) 5773ms
     name                                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · "@httpx/plain-object": `isPlainObject(v)`        1,395,419.02  0.0006  1.8273  0.0007  0.0007  0.0012  0.0013  0.0022  ±1.01%   697710   fastest
   · "is-plain-obj":"4.1.0": 'isPlainObj(v)'          1,308,696.50  0.0006  1.0286  0.0008  0.0007  0.0013  0.0013  0.0022  ±0.71%   654349
   · "@sindresorhus/is":"7.0.1": 'is.plainObject(v)'    780,257.18  0.0011  0.9150  0.0013  0.0012  0.0024  0.0025  0.0073  ±0.56%   390129
   · "es-toolkit":"1.31.0": 'isPlainObject(v)'        1,077,076.98  0.0007  2.5125  0.0009  0.0008  0.0016  0.0017  0.0118  ±1.46%   538539
   · "redux":"5.0.1": 'isPlainObject(v)'                473,750.80  0.0017  0.9967  0.0021  0.0019  0.0034  0.0038  0.0197  ±0.70%   236878
   · "is-plain-object":"5.0.0": 'isPlainObject(v)'      569,808.67  0.0014  2.0280  0.0018  0.0016  0.0031  0.0033  0.0199  ±1.25%   284905
   · lodash-es:"4.17.21": '_.isPlainObject(v)'           19,551.73  0.0452  1.2833  0.0511  0.0473  0.1073  0.1498  0.3331  ±0.96%     9776   slowest

 BENCH  Summary

  "@httpx/plain-object": `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
    1.07x faster than "is-plain-obj":"4.1.0": 'isPlainObj(v)'
    1.30x faster than "es-toolkit":"1.31.0": 'isPlainObject(v)'
    1.79x faster than "@sindresorhus/is":"7.0.1": 'is.plainObject(v)'
    2.45x faster than "is-plain-object":"5.0.0": 'isPlainObject(v)'
    2.95x faster than "redux":"5.0.1": 'isPlainObject(v)'
    71.37x faster than lodash-es:"4.17.21": '_.isPlainObject(v)'
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.size-limit.cjs)

| Scenario (esm)                                              | Size (compressed) |
|-------------------------------------------------------------|------------------:|
| `import { isPlainObject } from '@httpx/plain-object`        |             ~ 80B |
| `import { assertPlainObject } from '@httpx/plain-object`    |            ~ 134B |
| `Both isPlainObject and assertPlainObject`                  |            ~ 142B |
| `import { isStaticBuiltInClass } from '@httpx/plain-object` |             ~ 37B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/plain-object@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                    |
|------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                      |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                            |
| Browsers   | ✅  | [> 96%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) on 07/2024. Mins to [Chrome 96+, Firefox 90+, Edge 19+, iOS 12+, Safari 12+, Opera 77+](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                       | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                         |
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                  |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                   |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                      |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

| Library                                                        | Compat      | Perf         | CJS+ESM |
|----------------------------------------------------------------|-------------|--------------|---------|  
| [is-plain-obj](https://github.com/sindresorhus/is-plain-obj)   | Differences | 1.09x slower | No      | 
| [es-toolkit](https://github.com/toss/es-toolkit)               | No          |              | Yes     | 
| (@redux)[isPlainObject](https://github.com/reduxjs/redux)      | ✅ 100%      | 2.80x slower | Yes     |

### redux/isPlainObject

100% compatible see tests.

### @sindresorhus/is-plain-obj

This library wouldn't be possible without [@sindresorhus](https://github.com/sindresorhus) [is-plain-obj](https://github.com/sindresorhus/is-plain-obj).
Notable differences:

- [x] Slightly faster (10%)
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

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
