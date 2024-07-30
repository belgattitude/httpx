# @httpx/plain-object


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

- 👉&nbsp; Lightweight (~100b) and fast performance.
- 👉&nbsp; Extended typescript support ()
- 👉&nbsp; Modern es 
- 👉&nbsp; Up to 20x faster than non-memoized Intl constructors.
- 👉&nbsp; Decrease memory usage, unwanted memory leaks and garbage collection pressure.
- 👉&nbsp; Max out 50 cache instances by default with [quick-lru](https://github.com/sindresorhus/quick-lru).
- 👉&nbsp; Lightweight. [Node, browser and edge support](#compatibility).

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/plain-object) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/plain-object#readme)

## Usage

### isPlainObject

```typescript

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




## Benchmarks

Performance is monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx).

[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)


`IntlNumberFormat(locale, options) x 10_000`, see [bench](./bench/m-intl.bench.ts) for details. 

```
 RUN  v1.6.0 /home/sebastien/github/httpx/packages/plain-object

 ✓ bench/comparative.bench.ts (5) 3753ms
   ✓ Compare calling isPlainObject with 100x mixed types values (5) 3751ms
     name                                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/plain-object: `isPlainObject(v)`              557,521.22  0.0017  0.0289  0.0018  0.0018  0.0021  0.0026  0.0028  ±0.05%   278761   fastest
   · (sindresorhus)/is-plain-obj: `isPlainObj(v)`         532,060.44  0.0017  0.2708  0.0019  0.0019  0.0024  0.0026  0.0027  ±0.13%   266031
   · @sindresorhus/is: `is.plainObject(v)`                438,130.98  0.0021  0.0200  0.0023  0.0023  0.0024  0.0037  0.0044  ±0.06%   219066
   · (jonschlinkert)/is-plain-object: `isPlainObject(v)`  419,321.37  0.0022  0.1585  0.0024  0.0024  0.0027  0.0029  0.0046  ±0.18%   209661
   · lodash-es: `_.isPlainObject(v)`                       11,874.49  0.0785  0.4330  0.0842  0.0841  0.1018  0.1432  0.2800  ±0.33%     5938   slowest


 BENCH  Summary

  @httpx/plain-object: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 100x mixed types values
    1.05x faster than (sindresorhus)/is-plain-obj: `isPlainObj(v)`
    1.27x faster than @sindresorhus/is: `is.plainObject(v)`
    1.33x faster than (jonschlinkert)/is-plain-object: `isPlainObject(v)`
    46.95x faster than lodash-es: `_.isPlainObject(v)`

```

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/plain-object/.size-limit.cjs)

| Scenario (esm)                                           | Size (compressed) |
|----------------------------------------------------------|------------------:|
| `import { isPlainObject } from '@httpx/plain-object`     |            ~ 100B |
| `import { assertPlainObject } from '@httpx/plain-object` |            ~ 160B |
| `isPlainObject + assertPlainObject`                      |            ~ 325B |


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

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
