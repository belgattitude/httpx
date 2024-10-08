# @httpx/plain-object

[Fast](#benchmarks) and lightweight ([~100B](#bundle-size)) functions to check or assert
that a value is a plain object.

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
- 📐&nbsp; Lightweight (starts at [~100B](#bundle-size)) 
- 🫶&nbsp; Inspired and compatible with [@sindresorhus/is-plain-obj](#credits).
- 🛡️&nbsp; Tested on [node 18-22, browser and runtime/edge](#compatibility).
- 🙏&nbsp; Cross-realms tolerant (node:vm runInNewContext,...)
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/plain-object) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/plain-object#readme)

## Usage

### isPlainObject

```typescript
import { isPlainObject } from '@httpx/plain-object';

// ✅👇 True

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

// ❌👇 False

class Test { };
isPlainObject(new Test())           // ❌ 
isPlainObject(10);                  // ❌ 
isPlainObject(null);                // ❌ 
isPlainObject('hello');             // ❌ 
isPlainObject([]);                  // ❌ 
isPlainObject(new Date());          // ❌ 
isPlainObject(Math);                // ❌ Static built-in classes 
isPlainObject(Promise.resolve({})); // ❌
isPlainObject(Object.create({}));   // ❌
```

### assertPlainObject

```typescript
import { assertPlainObject } from '@httpx/plain-object';
import type { PlainObject } from '@httpx/plain-object';

function fn(value: unknown) {

    // 👇 Throws `new TypeError('Not a plain object')` if not a plain object
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
 RUN  v2.1.2 /home/sebastien/github/httpx/packages/plain-object

 ✓ bench/comparative.bench.ts (6) 4398ms
   ✓ Compare calling isPlainObject with 100x mixed types values (6) 4396ms
     name                                                         hz     min      max    mean     p75     p99    p995    p999     rme  samples      
   · @httpx/plain-object: `isPlainObject(v)`              870,872.90  0.0009   8.7832  0.0011  0.0010  0.0019  0.0021  0.0068  ±4.74%   435437   fastest
   · (sindresorhus/)is-plain-obj: `isPlainObj(v)`         847,061.21  0.0009   6.4363  0.0012  0.0010  0.0019  0.0020  0.0088  ±5.07%   423531      
   · @sindresorhus/is: `is.plainObject(v)`                515,510.42  0.0015  11.1225  0.0019  0.0017  0.0030  0.0032  0.0092  ±7.23%   257756      
   · estoolkit:  `isPlainObject(v)`                       223,151.78  0.0037   1.5797  0.0045  0.0041  0.0076  0.0090  0.0311  ±1.21%   111576      
   · (jonschlinkert/)is-plain-object: `isPlainObject(v)`  376,177.02  0.0020   8.2668  0.0027  0.0023  0.0039  0.0047  0.0277  ±4.96%   188089      
   · lodash-es: `_.isPlainObject(v)`                       15,546.36  0.0533   6.8019  0.0643  0.0555  0.1326  0.2533  0.6342  ±3.14%     7774   slowest


 BENCH  Summary

  @httpx/plain-object: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 100x mixed types values
    1.03x faster than (sindresorhus/)is-plain-obj: `isPlainObj(v)`
    1.69x faster than @sindresorhus/is: `is.plainObject(v)`
    2.32x faster than (jonschlinkert/)is-plain-object: `isPlainObject(v)`
    3.90x faster than estoolkit:  `isPlainObject(v)`
    56.02x faster than lodash-es: `_.isPlainObject(v)`

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.size-limit.cjs)

| Scenario (esm)                                           | Size (compressed) |
|----------------------------------------------------------|------------------:|
| `import { isPlainObject } from '@httpx/plain-object`     |            ~ 100B |
| `import { assertPlainObject } from '@httpx/plain-object` |            ~ 160B |
| `isPlainObject + assertPlainObject`                      |            ~ 170B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/plain-object@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                    |
|------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                      |
| Browsers   | ✅  | [> 96%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) on 07/2024. Mins to [Chrome 96+, Firefox 90+, Edge 19+, iOS 12+, Safari 12+, Opera 77+](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.browserslistrc) |
| Edge       | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                             | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                  |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                   |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                      |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Credits

### @sindresorhus/is-plain-obj

This library wouldn't be possible without [@sindresorhus](https://github.com/sindresorhus) [is-plain-obj](https://github.com/sindresorhus/is-plain-obj).
It passes the same test suite and should be 100% compatible with it. Notable differences:

- [x] Slighly smaller bundle and performance.
- [x] Named export.
- [x] Provide a `PlainObject` type and `assertPlainObject` function.
- [x] Typescript convenience `PlainObject` type.
- [x] ESM and CJS formats.

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
