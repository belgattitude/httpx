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


## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/assert), [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/assert#readme) or [generated api doc]()

## Usage

### Object related

```typescript
import { isPainObject, assertPlainObject } from '@httpx/assert';

isPlainObject({cool: true}); // true
isPlainObject(new Promise()); // false
assertPlainObject({});
```

### String related

```typescript
import { assertStrNotEmpty, isStrNotEmpty } from '@httpx/assert';

isStrNotEmpty(''); // false
isStrNotEmpty(' '); // false: trim by default
isStrNotEmpty(' ', false); // true: disbable trim
assertStrNotEmpty('');
```

### Uuid

Supported uuid versions are: 1, 3, 4 and 5.

```typescript
import { isUuid, isUuidV1, isUuidV3, isUuidV4, isUuidV5 } from "@httpx/assert";
import { assertUuid, assertUuidV1, assertUuidV3, assertUuidV4, assertUuidV5 } from "@httpx/assert";
import { getUuidVersion } from '@httpx/assert';

// Without version
isUuid('90123e1c-7512-523e-bb28-76fab9f2f73d'); // is valid uuid v1, 3, 4 or 5
assertUuid('90123e1c-7512-523e-bb28-76fab9f2f73d');

// With version
isUuid('90123e1c-7512-523e-bb28-76fab9f2f73d', 5);
assertUuid('90123e1c-7512-523e-bb28-76fab9f2f73d', 5);
assertUuidV5('90123e1c-7512-523e-bb28-76fab9f2f73d')
isUuidV4('d9428888-122b-11e1-b85c-61cd3cbb3210'); // or isUuidV1(''), isUuidV3(''), isUuidV5('');

// Utils
getUuidVersion('90123e1c-7512-523e-bb28-76fab9f2f73d'); // 5
```

### Barcode

Supported barcodes is currently limited to Ean13

```typescript
import { isEan13 } from "@httpx/assert";
import { assertEan13 } from "@httpx/assert";

isEan13('1234567890128'); // 👈 will check digit too
assertEan13('1234567890128');
```


### Bundle size

Code and bundler have been tuned to target a minimal compressed footprint
for the browser. 

ESM individual imports are tracked by a
[size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/assert/.size-limit.cjs).

| Scenario                               | Size (compressed) |
|----------------------------------------|------------------:|
| All typeguards, assertions and helpers |            ~ 900b |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/exception@latest).


## Compatibility

ES2021 / Node 16+ and the following browsers: [Chrome 96+, Firefox 90+, Edge 19+, Safari 12+, Opera 77+](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D).

Edge tests are run with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime)

Browser builds follows the [.browserslistrc](https://github.com/belgattitude/httpx/blob/main/packages/exception/.browserslistrc)
configuration. 

For _older_ browsers:

- Most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

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
