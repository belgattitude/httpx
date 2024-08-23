# @httpx/treeu

[Fast](#benchmarks) and lightweight ([~100B](#bundle-size)) functions to check or assert
that a value is a plain object.

[![npm](https://img.shields.io/npm/v/@httpx/treeu?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/treeu)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-treeu-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Ftreeu)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/treeu@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/treeu@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/treeu?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/treeu)
[![license](https://img.shields.io/npm/l/@httpx/treeu?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/treeu
$ yarn add @httpx/treeu
$ pnpm add @httpx/treeu
```

## Features

- 👉&nbsp; Provide [isPlainObject](#isplainobject) and [assertPlainObject](#assertplainobject) functions.
- 👉&nbsp; Convenience [PlainObject](#plainobject-type) type.
- 👉&nbsp; Faster than most alternatives, see [benchmarks](#benchmarks).
- 👉&nbsp; Lightweight (starts at [~100B](#bundle-size)) and [node, browser and edge support](#compatibility).
- 👉&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/treeu) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/treeu#readme)

## Usage

### isPlainObject

```typescript
import { isPlainObject } from '@httpx/treeu';

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
import { assertPlainObject } from '@httpx/treeu';
import type { PlainObject } from '@httpx/treeu';

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
import { isPlainObject } from '@httpx/treeu';
import type { PlainObject } from '@httpx/treeu';

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
import { assertPlainObject } from '@httpx/treeu';
import type { PlainObject } from '@httpx/treeu';

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
 RUN  v2.0.5 /home/sebastien/github/httpx/packages/treeu

 ✓ bench/comparative.bench.ts (6) 4778ms
   ✓ Compare calling isPlainObject with 100x mixed types values (6) 4779ms
     name                                                           hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/treeu: `isPlainObject(v)`              1,494,047.57  0.0005   8.3748  0.0007  0.0007  0.0008  0.0009  0.0047  ±3.40%   747024   fastest
   · (sindresorhus/)is-plain-obj: `isPlainObj(v)`         1,314,933.16  0.0005  11.7854  0.0008  0.0007  0.0014  0.0015  0.0022  ±6.83%   657467
   · @sindresorhus/is: `is.plainObject(v)`                  934,442.37  0.0009   2.1268  0.0011  0.0011  0.0015  0.0018  0.0065  ±1.38%   467222
   · estoolkit:  `isPlainObject(v)`                         378,403.92  0.0020  10.3395  0.0026  0.0026  0.0035  0.0055  0.0155  ±4.23%   189202
   · (jonschlinkert/)is-treeu: `isPlainObject(v)`    629,387.99  0.0012  13.2170  0.0016  0.0015  0.0023  0.0030  0.0129  ±6.81%   314694
   · lodash-es: `_.isPlainObject(v)`                         21,164.79  0.0361  11.2577  0.0472  0.0446  0.1057  0.1678  0.5020  ±5.03%    10583   slowest


 BENCH  Summary

  @httpx/treeu: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 100x mixed types values
    1.14x faster than (sindresorhus/)is-plain-obj: `isPlainObj(v)`
    1.60x faster than @sindresorhus/is: `is.plainObject(v)`
    2.37x faster than (jonschlinkert/)is-treeu: `isPlainObject(v)`
    3.95x faster than estoolkit:  `isPlainObject(v)`
    70.59x faster than lodash-es: `_.isPlainObject(v)`

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/treeu/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.cjs)

| Scenario (esm)                                           | Size (compressed) |
|----------------------------------------------------------|------------------:|
| `import { isPlainObject } from '@httpx/treeu`     |            ~ 100B |
| `import { assertPlainObject } from '@httpx/treeu` |            ~ 160B |
| `isPlainObject + assertPlainObject`                      |            ~ 170B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/treeu@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                    |
|------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                      |
| Browsers   | ✅  | [> 96%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) on 07/2024. Mins to [Chrome 96+, Firefox 90+, Edge 19+, iOS 12+, Safari 12+, Opera 77+](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.browserslistrc) |
| Edge       | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                             | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                  |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                   |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                      |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Credits

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
