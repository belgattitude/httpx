# @httpx/assert

Assertions and typeguards as primitives

[![npm](https://img.shields.io/npm/v/@httpx/assert?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/assert)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/assert/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-assert-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fassert)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/assert/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/assert@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/assert@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/assert?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/assert)
[![license](https://img.shields.io/npm/l/@httpx/assert?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

> **warning**: pre-v1, use at your own risks

## Install

```bash
$ npm install @httpx/assert
$ yarn add @httpx/assert
$ pnpm add @httpx/assert
```

## Features

- 👉&nbsp; Typeguards and assertions with a consistent style.
- 👉&nbsp; Assertions with useful [default error message](#assertions-error-messages).
- 👉&nbsp; Return *weak* [opaque types](#weak-opaque-types) for boolean, strings and numbers.
- 👉&nbsp; Optimized tree-shakability, starts at [56b](#bundle-size).
- 👉&nbsp; Don't leak values in the default assertion error messages.
- 👉&nbsp; No deps. [Node, browser and edge support](#compatibility).

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/assert), [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/assert#readme) or [generated api doc](https://github.com/belgattitude/httpx/blob/main/packages/assert/docs/api/README.md)

---

- [Introduction](#introduction)
  * [Consistent style](#consistent-style)
  * [Weak opaque types](#weak-opaque-types)
  * [Assertions error messages](#assertions-error-messages)
- [Usage](#usage)
  * [Type related](#type-related)
    + [assertNever](#assertnever)
  * [Object related](#object-related)
    + [isPlainObject](#isplainobject)
  * [Number related](#number-related)
    + [isNumberSafeInt](#isnumbersafeint)
  * [Array related](#array-related)
    + [ArrayNonEmpty](#arraynonempty)
  * [String related](#string-related)
    + [StringNonEmpty](#stringnonempty)
    + [ParsableSafeInt](#parsablesafeint)
    + [isParsableStrictIsoDateZ](#isparsablestrictisodatez)
  * [Uuid](#uuid)
    + [isUuid](#isuuid)
  * [Barcode](#barcode)
    + [isEan13](#isean13)
  * [Network](#network)
    + [isNetWorkPort](#isnetworkport)
  * [Http](#http)
    + [isHttpMethod](#ishttpmethod)
    + [isValidHttpMethod](#isvalidhttpmethod)
- [Bundle size](#bundle-size)
- [Compatibility](#compatibility)
- [Acknowledgments](#acknowledgments)
- [Contributors](#contributors)
- [Sponsors](#sponsors)


## Introduction

### Consistent style

Typeguards starts with `isXXX` and have an assertion counterpart named `assertXXX`.

`isParsableXXX` and `assertParsableXXX` denotes a string.

### Weak opaque types

For `string`, `number` and `boolean` the returned type is tagged with a *weak* opaque type.
It can optionally be used to enforce that the value was checked.

For example:

```typescript
import { assertUuidV7, type UuidV7 } from '@httpx/assert';
import { HttpUnprocessableEntity } from '@httpx/exception';

const persistRecord = async (uuid: UuidV7) => {
  // uuid is compatible with string.
  return await db.raw(`insert into tbl(uuid) values (${uuid})`)
}

const v = 'xxx'; // unknown
assertUuidV7(v, () => new HttpUnprocessableEntity());
// 👉 v is known to be `string & WeakOpaqueContainer<'UuidV4'>`
await persistRecord(v); // will work
await persistRecord('a_string'); // won't
```

### Assertions error messages

When an assertion fail, a native [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 
is thrown by default with a message indicating the requirement and and information about the
tested value. As an example:

```typescript
expect(() => assertUuid('123')).toThrow(
  new TypeError('Value is expected to be an uuid, got: string(length:3)')
);
expect(() => assertUuid(false, undefined, { version: 1 })).toThrow(
  new TypeError('Value is expected to be an uuid v1, got: boolean(false)')
);
expect(() => assertUuidV1(Number.NaN)).toThrow(
  new TypeError('Value is expected to be an uuid v1, got: NaN')
);
expect(() => assertUuidV3(new Error())).toThrow(
  new TypeError('Value is expected to be an uuid v3, got: Error')
);
expect(() => assertUuidV4(new Date())).toThrow(
  new TypeError('Value is expected to be an uuid v4, got: Date')
);
expect(() => assertUuidV5(() => {})).toThrow(
  new TypeError('Value is expected to be an uuid v5, got: function')
);
expect(() => assertUuidV7(() => {})).toThrow(
  new TypeError('Value is expected to be an uuid v7, got: function')
);
//...
```

Alternatively it's possible to provide either a message or function returning
an Error. For example:

```typescript
import { assertEan13, assertStringNonEmpty } from '@httpx/assert';
import { HttpBadRequest } from '@httpx/exception';

assertEan13('123', 'Not a barcode'); // 👈 Will throw a TypeError('Not a barcode')

assertStringNonEmpty(lang, () => new HttpBadRequest('Missing language'));
```

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

| Name                    | Type             | Comment |
|-------------------------|------------------|---------|
| isPlainObject\<T?\>     | `PlainObject` |         |
| assertPlainObject\<T?\> | `PlainObject` |         |

```typescript

import { isPlainObject, assertPlainObject } from '@httpx/assert';

// Simple case: without generic value
isPlainObject({cwol: true}); // 👈 true
isPlainObject(new Promise()); // 👈 false
assertPlainObject({});

// With generic value (unchecked at runtime!)
type CustomType = {
  name: string;
  deep: {
    yes: boolean | null;
  };
};
const value = {
  name: 'hello',
  deep: {
    yes: true,
  },
} as unknown;

if (isPlainObject<CustomType>(value)) {
  // Notice it's a deep partial to allow autocompletion
  value?.deep?.yes; // 👈  yes will be unknown to reflect that no runtime check was done
}
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

#### ArrayNonEmpty


| Name                | Type        | Opaque type     | Comment         |
|---------------------|-------------|-----------------|-----------------|
| isArrayNonEmpty     | `unknown[]` | `ArrayNonEmpty` |  |
| assertArrayNonEmpty | `unknown[]` | `ArrayNonEmpty` |  |


```typescript
import { isArrayNonEmpty, assertArrayNonEmpty, type ArrayNonEmpty } from '@httpx/assert';

isArrayNonEmpty([]) // 👉 false
isArrayNonEmpty([0,1]) // 👉 true
isArrayNonEmpty([null]) // 👉 true
assertArrayNonEmpty([]) // 👉 throws
```

### String related

#### StringNonEmpty

| Name                 | Type      | Opaque type      | Comment         |
|----------------------|-----------|------------------|-----------------|
| isStringNonEmpty     | `string`  | `StringNonEmpty` | Trims the value |
| assertStringNonEmpty | `string`  | `StringNonEmpty` | Trims the value |

```typescript
import { assertStringNonEmpty, isStringNonEmpty, type StringNonEmpty } from '@httpx/assert';

isStringNonEmpty(''); // 👉 false
isStringNonEmpty(' '); // 👉 false: trim by default
assertStringNonEmpty(''); // 👉 throws
```

#### ParsableSafeInt

| Name                  | Type      | Opaque type       | Comment         |
|-----------------------|-----------|-------------------|-----------------|
| isParsableSafeInt     | `string`  | `ParsableSafeInt` |  |
| assertParsableSafeInt | `string`  | `ParsableSafeInt` |  |


```typescript
import { assertStrParsableSafeInt, isStrParsableSafeInt } from '@httpx/assert';

isStrParsableSafeInt(2); // 👉 false
isStrParsableSafeInt(`${Number.MAX_SAFE_INTEGER}`); // 👉 true
assertStrParsableSafeInt(`${Number.MAX_SAFE_INTEGER}1`); // 👉 throws
```

#### isParsableStrictIsoDateZ

Ensure a string contains a strict iso datetime with microseconds and utc suffix
(aka: zulu time). Date is checked for validity.


| Name                         | Type      | Opaque type              | Comment         |
|------------------------------|-----------|--------------------------|-----------------|
| isParsableStrictIsoDateZ     | `string`  | `ParsableStrictIsoDateZ` |  |
| assertParsableStrictIsoDateZ | `string`  | `ParsableStrictIsoDateZ`        |  |

```typescript
import { isParsableStrictIsoDateZ, assertParsableStrictIsoDateZ, type ParsableStrictIsoDateZ } from '@httpx/assert';

isParsableStrictIsoDateZ(new Date().toISOString()); // 👉 true
isParsableStrictIsoDateZ('2023-12-29T23:37:31.653z'); // 👉 true
isParsableStrictIsoDateZ('2023-02-29T23:37:31.653'); // 👉 false, cause no 29th february in 2023

assertParsableStrictIsoDateZ('2023-02-29T23:37:31.653z'); // 👉 throws cause no 29th february
```

### Uuid

#### isUuid

| Name           | Type                    | Opaque type                                      | Comment |
|----------------|-------------------------|--------------------------------------------------|--------|
| isUuid         | `string`                | `UuidV1 \| UuidV3 \| UuidV4 \| UuidV5 \| UuidV7` |  |
| isUuidV1       | `string`                | `UuidV1`                                         |  |
| isUuidV3       | `string`                | `UuidV3`                                         |  |
| isUuidV4       | `string`                | `UuidV4`                                         |  |
| isUuidV5       | `string`                | `UuidV5`                                         |  |
| isUuidV7       | `string`                | `UuidV7`                                         |  |
| assertUuid     | `string`                | `UuidV1 \| UuidV3 \| UuidV4 \| UuidV5 \| UuidV7` |        |
| assertUuidV1   | `string`                | `UuidV5`                                         |        |
| assertUuidV3   | `string`                | `UuidV3`                                         |        |
| assertUuidV4   | `string`                | `UuidV4`                                         |        |
| assertUuidV5   | `string`                | `UuidV5`                                         |        |
| assertUuidV7   | `string`                | `UuidV7`                                         |        |
| getUuidVersion | `1 \| 3 \| 4 \| 5 \| 7` |                                                  |        |

```typescript
import { isUuid, isUuidV1, isUuidV3, isUuidV4, isUuidV5 } from "@httpx/assert";
import { assertUuid, assertUuidV1, assertUuidV3, assertUuidV4, assertUuidV5 } from "@httpx/assert";
import { getUuidVersion } from '@httpx/assert';

// Without version
isUuid('90123e1c-7512-523e-bb28-76fab9f2f73d'); // 👉 valid uuid v1, 3, 4 or 5
assertUuid('90123e1c-7512-523e-bb28-76fab9f2f73d');

// With version
assertUuid('90123e1c-7512-523e-bb28-76fab9f2f73d');
assertUuidV5('90123e1c-7512-523e-bb28-76fab9f2f73d')
isUuid('90123e1c-7512-523e-bb28-76fab9f2f73d');
isUuidV4('d9428888-122b-11e1-b85c-61cd3cbb3210'); // 👈 or isUuidV1(''), isUuidV3(''), isUuidV5('')...;

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

### Network

#### isNetWorkPort

Check whether the value is a valid tcp/udp network port (0-65535)

```typescript
import { isNetworkPort } from "@httpx/assert";
import { assertNetworkPort } from "@httpx/assert";
import { type NetworkPort } from "@httpx/assert";

isNetworkPort(443); // 👈 weak opaque type is NetworkPort
assertNetworkPort(443);
```

### Http

#### isHttpMethod

Check whether the value is a specific http method (case-insensitive).

```typescript
import { isHttpMethod } from "@httpx/assert";
import { assertHttpMethod } from "@httpx/assert";
import { type HttpMethod } from "@httpx/assert";

const value: unknown = 'GET';

isHttpMethod('GET', value); // 👈 weak opaque type is HttpMethod
assertHttpMethod('GET', value);
```

#### isValidHttpMethod

Check whether the value is a valid http method (case-insensitive).

```typescript
import { isHttpValidMethod } from "@httpx/assert";
import { assertHttpValidMethod } from "@httpx/assert";
import { type HttpMethod } from "@httpx/assert";

const value: unknown = 'GET';

isHttpValidMethod(value); // 👈 weak opaque type is HttpMethod
assertHttpValidMethod(value);
```

## Bundle size

Code and bundler have been tuned to target a minimal compressed footprint
for the browser. 

ESM individual imports are tracked by a
[size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/assert/.size-limit.cjs).

| Scenario                               | Size (compressed) |
|----------------------------------------|------------------:|
| Import `isPlainObject`                 |            ~ 100b |
| Import `isUuid`                        |            ~ 175b |
| Import `isEan13`                       |            ~ 117b |
| All typeguards, assertions and helpers |           ~ 1700b |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/assert@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                              |
|------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                |
| Browsers   | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) on 12/2023. Mins to [Chrome 96+, Firefox 90+, Edge 19+, iOS 12+, Safari 12+, Opera 77+](https://github.com/belgattitude/httpx/blob/main/packages/assert/.browserslistrc) |
| Edge       | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                       | 
| Typescript | ✅  | TS 5.0+ / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                             |  
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                             |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Acknowledgments

Special thanks for inspiration: 

- [sindresorhus/is](https://github.com/sindresorhus/is)
- [webmozarts/assert](https://github.com/webmozarts/assert)

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
