# @httpx/assert

Assertions and typeguards as primitives

[![npm](https://img.shields.io/npm/v/@httpx/assert?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/assert)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/assert/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-assert-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fassert)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/assert/.size-limit.cjs)
![node](https://img.shields.io/static/v1?label=Node&message=16%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/assert@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/assert@latest)
[![maintainability](https://img.shields.io/codeclimate/maintainability/belgattitude/httpx?label=Quality&logo=code-climate&style=for-the-badge&labelColor=444)](https://codeclimate.com/github/belgattitude/httpx)
[![downloads](https://img.shields.io/npm/dm/@httpx/assert?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/assert)
[![license](https://img.shields.io/npm/l/@httpx/assert?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/assert
$ yarn add @httpx/assert
$ pnpm add @httpx/assert
```

## Features

Wip

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/assert), [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/assert#readme) or [generated api doc](https://github.com/belgattitude/httpx/blob/main/packages/assert/docs/api/README.md)

- [Usage](#usage)
  * [Type related](#type-related)
  * [Object related](#object-related)
  * [String related](#string-related)
  * [Uuid](#uuid)
  * [Barcode](#barcode)
- [Bundle size](#bundle-size)
- [Compatibility](#compatibility)
- [Contributors](#contributors)
- [Sponsors](#sponsors)

## Usage

### Type related

#### assertNever

```typescript
import { assertNever } from '@httpx/assert';

type PromiseState = 'resolved' | 'rejected' | 'running'
const state: PromiseState = 'rejected';
switch(state) {
  case 'resolved': return v;
  case 'rejected': return new Error();
  default:
    assertNever(state); // 👈 TS will complain about missing 'running' state
    // ☝️ Will throw a TypeError in js.
}
```

> PS: you can use the `assertNeverNoThrow` with the same behaviour except that it
> doesn't throw and return the value instead (no runtime error).

### Object related

#### isPlainObject

```typescript
import { isPainObject, assertPlainObject } from '@httpx/assert';

isPlainObject({cool: true}); // 👈 true
isPlainObject(new Promise()); // 👈 false
assertPlainObject({});
```

### Number related

#### isNumberSafeInt

```typescript
import { assertNumberSafeInt, isNumberSafeInt } from '@httpx/assert';

isNumberSafeInt(10n); // 👉 false
isNumberSafeInt(BigInt(10)); // 👉 false
isNumberSafeInt(Number.MAX_SAFE_INTEGER); // 👉 true
assertNumberSafeInt(Number.MAX_SAFE_INTEGER + 1); // 👉 throws
```

### Array related

#### isArrayNotEmpty

```typescript
import { isArrayNotEmpty, assertArrayNotEmpty } from '@httpx/assert';

isArrayNotEmpty([]) // 👉 false
isArrayNotEmpty([0,1]) // 👉 true
assertArrayNotEmpty([]) // 👉 throws
```

### String related

#### isStrNotEmpty

```typescript
import { assertStrNotEmpty, isStrNotEmpty } from '@httpx/assert';

isStrNotEmpty(''); // 👉 false
isStrNotEmpty(' '); // 👉 false: trim by default
isStrNotEmpty(' ', { trim: false }); // 👉 true: disbable trim
assertStrNotEmpty(''); // 👉 throws
assertStrNotEmpty('', undefined, { trim: false });
```

#### isStrParsableSafeInt

```typescript
import { assertStrParsableSafeInt, isStrParsableSafeInt } from '@httpx/assert';

isStrParsableSafeInt(2); // 👉 false
isStrParsableSafeInt(`${Number.MAX_SAFE_INTEGER}`); // 👉 true
assertStrParsableSafeInt(`${Number.MAX_SAFE_INTEGER}1`); // 👉 throws
```


### Uuid

#### isUuid

Supported uuid versions are: 1, 3, 4 and 5.

```typescript
import { isUuid, isUuidV1, isUuidV3, isUuidV4, isUuidV5 } from "@httpx/assert";
import { assertUuid, assertUuidV1, assertUuidV3, assertUuidV4, assertUuidV5 } from "@httpx/assert";
import { getUuidVersion } from '@httpx/assert';

// Without version
isUuid('90123e1c-7512-523e-bb28-76fab9f2f73d'); // 👉 valid uuid v1, 3, 4 or 5
assertUuid('90123e1c-7512-523e-bb28-76fab9f2f73d');

// With version
isUuid('90123e1c-7512-523e-bb28-76fab9f2f73d', { version: 5 });
assertUuid('90123e1c-7512-523e-bb28-76fab9f2f73d', undefined, { version: 5 });
assertUuidV5('90123e1c-7512-523e-bb28-76fab9f2f73d')
isUuidV4('d9428888-122b-11e1-b85c-61cd3cbb3210'); // 👈 or isUuidV1(''), isUuidV3(''), isUuidV5('');

// Utils
getUuidVersion('90123e1c-7512-523e-bb28-76fab9f2f73d'); // 5
```

### Barcode

#### isEan13

Supported barcodes is currently limited to Ean13

```typescript
import { isEan13 } from "@httpx/assert";
import { assertEan13 } from "@httpx/assert";

isEan13('1234567890128'); // 👈 will check digit too
assertEan13('1234567890128');
```

## Bundle size

Code and bundler have been tuned to target a minimal compressed footprint
for the browser. 

ESM individual imports are tracked by a
[size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/assert/.size-limit.cjs).

| Scenario                               | Size (compressed) |
|----------------------------------------|------------------:|
| Import `isPlainObject`                 |             ~ 56b |
| Import `isUuid`                        |            ~ 175b |
| Import `isEan13`                       |            ~ 117b |
| All typeguards, assertions and helpers |            ~ 900b |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/assert@latest).


## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
|------------|----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| ES2021     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                                        |
| Node16     | ✅  |                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Node18     | ✅  | Ensured on CI                                                                                                                                                                                                                                                                                                                                                                                                       |
| Node20     | ✅  | Ensured on CI                                                                                                                                                                                                                                                                                                                                                                                                       |
| Edge       | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime)                                                                                                                                                                                                                                                                                                                                   | 
| Browsers   | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) on 12/2023. Minimums to [Chrome 96+, Firefox 90+, Edge 19+, iOS 12+, Safari 12+, Opera 77+](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) | 
| Typescript | ✅  | TS 4.7+ / Dual packaging is ensured with [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) on the CI.                                                                                                                                                                                                                                                                            | 

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
