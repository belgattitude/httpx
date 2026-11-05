# @httpx/barcode

[![npm](https://img.shields.io/npm/v/@httpx/barcode?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/barcode) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/barcode/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-barcode-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fbarcode) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/barcode/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=22%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/barcode?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/barcode) [![license](https://img.shields.io/npm/l/@httpx/barcode?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

Barcode utilities: detect barcode types (EAN-13, EAN-8, UPC-A, GTIN-14) and validate GTIN check digits.

## Install

```bash
$ npm install @httpx/barcode
$ yarn add @httpx/barcode
$ pnpm add @httpx/barcode
```

## Features

- 📐&nbsp; Lightweight (see [bundle size](#bundle-size)).
- 🛡️&nbsp; Tested on [node 22-26, browser, bun, cloudflare and deno](#compatibility).
- 🗝️&nbsp; Available in ESM.

## Documentation

### Restricted circulation EAN-8

EAN-8 codes starting with `0` or `2` are reserved by GS1 for restricted circulation (RCN-8: numbers only meaningful within a company, ie: in-store labels) and are refused by every function: guards, assertions, `detectBarcodeType`, `normalizeGtin` and `formatGtin`.

The rule is applied on the 14 digits form, so a restricted EAN-8 can't get through once padded or with its leading zeros lost:

```typescript
isEan8("21234569"); // 👈 false (starts with 2)
isEan8("01234565"); // 👈 false (starts with 0)
isUpcA("000021234569"); // 👈 false (same code padded as UPC-A)
normalizeGtin(1234565); // 👈 null ("01234565" with its leading zero lost)
isEan8("96385074"); // 👈 true
isUpcA("036000291452"); // 👈 true (only EAN-8 are concerned)
```

Other restricted circulation numbers (EAN-13, UPC-A) are accepted, use the opt-in [isRestrictedCirculation](#isrestrictedcirculation) check to detect them.

### detectBarcodeType

Detect the type of a barcode from its value: `ean8`, `upca`, `ean13` or `gtin14`. Returns `null` when the length isn't supported, the code contains anything other than digits, or the check digit is invalid.

```typescript
import { detectBarcodeType, type BarcodeType } from "@httpx/barcode";

detectBarcodeType("96385074"); // 👈 "ean8"
detectBarcodeType("036000291452"); // 👈 "upca"
detectBarcodeType("4006381333931"); // 👈 "ean13"
detectBarcodeType("10012345678902"); // 👈 "gtin14"
detectBarcodeType("4006381333932"); // 👈 null (invalid check digit)
detectBarcodeType(" 4006381333931"); // 👈 null (no trimming)
```

> A 13-digit code starting with `0` (an UPC-A expressed as EAN-13) is detected as `ean13`.

### Typeguards

`isEan13`, `isEan8`, `isUpcA` and `isGtin14` accept any value (`unknown`) and narrow it to a branded string type (`Ean13`, `Ean8`, `UpcA`, `Gtin14`) when it has the right length, only digits and a valid check digit. `isGtin` narrows to `Gtin` (any of them).

```typescript
import { isEan13, isGtin14, type Ean13 } from "@httpx/barcode";

const saveProduct = (ean: Ean13) => {
  /* ... */
};

const value: unknown = "4006381333931";

if (isEan13(value)) {
  saveProduct(value); // 👈 value is Ean13
}

saveProduct("4006381333931"); // 👈 TS error: a plain string is not an Ean13

isGtin14("10012345678902"); // 👈 true
isGtin14(10012345678902); // 👈 false (not a string)
```

> Branded types are compile-time only. A branded value is still a `string` (assignable to `string`), but a plain `string` must go through a typeguard to become one.

### Assertions

`assertEan13`, `assertEan8`, `assertUpcA`, `assertGtin14` and `assertGtin` narrow the value like their typeguard counterparts but throw when it's invalid. By default they throw a `TypeError` that describes the value without leaking its content.

```typescript
import { assertEan13 } from "@httpx/barcode";

const ean: unknown = "400638133393";

assertEan13(ean);
// 👈 throws TypeError('Value is expected to be an EAN-13, got: string(length:12)')

assertEan13(ean, "Invalid EAN-13");
// 👈 throws TypeError('Invalid EAN-13')

assertEan13(ean, () => new HttpBadRequest("Invalid EAN-13"));
// 👈 throws the error returned by the factory (ie: @httpx/exception)

assertEan13(ean, (v) => new Error(`Invalid EAN-13 (${typeof v})`));
// 👈 the factory receives the invalid value

// after the assertion, ean is typed as Ean13
```

| Function | Narrows to | Default message |
| --- | --- | --- |
| `assertEan13(v, msgOrErrorFactory?)` | `Ean13` | `Value is expected to be an EAN-13, got: …` |
| `assertEan8(v, msgOrErrorFactory?)` | `Ean8` | `Value is expected to be an EAN-8, got: …` |
| `assertUpcA(v, msgOrErrorFactory?)` | `UpcA` | `Value is expected to be a UPC-A, got: …` |
| `assertGtin14(v, msgOrErrorFactory?)` | `Gtin14` | `Value is expected to be a GTIN-14, got: …` |
| `assertGtin(v, msgOrErrorFactory?)` | `Gtin` | `Value is expected to be a GTIN, got: …` |

### normalizeGtin

GTINs are identifiers, not numbers: once stored as a number (JSON, spreadsheets, CSV, numeric database columns) the leading zeros are lost and `036000291452` (UPC-A) becomes `36000291452`. `normalizeGtin` accepts a string, a number or a bigint and returns the canonical 14 digits form (left-padded with zeros, as recommended by GS1 for storage and comparison), or `null` if invalid. The check digit isn't affected by the padding.

```typescript
import { normalizeGtin } from "@httpx/barcode";

normalizeGtin(36000291452); // 👈 "00036000291452"
normalizeGtin("036000291452"); // 👈 "00036000291452" (UPC-A)
normalizeGtin("0036000291452"); // 👈 "00036000291452" (same product, EAN-13)
normalizeGtin(4006381333931n); // 👈 "04006381333931"
normalizeGtin(4006380000000); // 👈 null (ie: excel "4.00638E+12", invalid check digit)
normalizeGtin(-1); // 👈 null (only non-negative safe integers)
normalizeGtin(" 4006381333931"); // 👈 null (no trimming)
```

The returned value is typed as `Gtin14`. Strings must contain only digits (no trimming or separators), numbers must be non-negative safe integers.

#### minLength

`minLength` (default `8`, the shortest GTIN) is the minimum number of digits of the input as given (leading zeros of strings are counted). Values with less than 8 significant digits are always refused (they would be an [EAN-8 starting with 0](#restricted-circulation-ean-8)), so the option is mostly useful to raise the minimum, ie: to refuse EAN-8:

```typescript
normalizeGtin(96385074); // 👈 "00000096385074"
normalizeGtin(96385074, { minLength: 12 }); // 👈 null (EAN-8 refused)
normalizeGtin("0036000291452", { minLength: 13 }); // 👈 "00036000291452"
normalizeGtin(36000291452, { minLength: 13 }); // 👈 null (11 digits)
```

#### assertNormalizedGtin

Same as `normalizeGtin` but throws instead of returning `null`. Accepts a message or an error factory (receiving the value), like the [assertions](#assertions), and `normalizeGtin` options as third parameter.

```typescript
import { assertNormalizedGtin } from "@httpx/barcode";

const gtin = assertNormalizedGtin(36000291452); // 👈 "00036000291452" (Gtin14)

assertNormalizedGtin(4006380000000);
// 👈 throws TypeError('Value is expected to be a GTIN, got: number')

assertNormalizedGtin(value, () => new HttpBadRequest("Invalid barcode"));
// 👈 throws the error returned by the factory

assertNormalizedGtin(value, undefined, { minLength: 12 });
```

### formatGtin

Format a valid GTIN to another length (8, 12, 13 or 14) by adding or removing leading zeros, ie: to display a normalized GTIN. Returns `null` if the input isn't a valid GTIN or if a non-zero digit would be removed. The result is typed according to the length (`Ean8`, `UpcA`, `Ean13` or `Gtin14`).

```typescript
import { formatGtin, normalizeGtin } from "@httpx/barcode";

const gtin = normalizeGtin(36000291452); // 👈 "00036000291452"

formatGtin(gtin ?? "", 12); // 👈 "036000291452" (UpcA)
formatGtin("00036000291452", 13); // 👈 "0036000291452" (Ean13)
formatGtin("96385074", 14); // 👈 "00000096385074" (Gtin14)
formatGtin("04006381333931", 12); // 👈 null (would drop the "4")
```

### isRestrictedCirculation

Opt-in check telling if a GTIN is a GS1 Restricted Circulation Number (RCN): a code only meaningful within a company or a geographic region (ie: in-store labels, variable measure items with an embedded weight or price), not a globally unique product identifier. Apart from [restricted EAN-8](#restricted-circulation-ean-8), RCNs are valid GTINs for the other functions.

```typescript
import { isRestrictedCirculation } from "@httpx/barcode";

isRestrictedCirculation("2123456789010"); // 👈 true (EAN-13 starting with 2)
isRestrictedCirculation("0412345678903"); // 👈 true (EAN-13 starting with 04)
isRestrictedCirculation("212345678992"); // 👈 true (UPC-A starting with 2)
isRestrictedCirculation(212345678909); // 👈 true ("0212345678909", leading zero lost)
isRestrictedCirculation("4006381333931"); // 👈 false
isRestrictedCirculation("2123456789011"); // 👈 false (invalid check digit)
```

| Code | Restricted circulation ranges |
| --- | --- |
| EAN-8 | starting with `0` or `2` |
| EAN-13 | starting with `02` or `20`-`29` (geographic region), `04` (company internal) |
| UPC-A | starting with `2` or `4` (same ranges, as an EAN-13 they start with `02` / `04`) |
| GTIN-14 | containing one of the above (digits after the indicator) |

It accepts the same values and options as [normalizeGtin](#normalizegtin) (string, number or bigint, `minLength`) and returns `false` for anything that isn't a GTIN with a valid check digit.

### isGtin

Check if a string is a valid GTIN (GTIN-8, GTIN-12/UPC-A, GTIN-13/EAN-13 or GTIN-14) by verifying its length and its mod-10 check digit.

```typescript
import { isGtin } from "@httpx/barcode";

isGtin("4006381333931"); // 👈 true
isGtin("4006381333932"); // 👈 false (invalid check digit)
```

## Benchmarks

Validation of 1000 generated codes (mostly ean13) with `isGtin(v)` compared to [zod](https://zod.dev) 4.6.7, on Node 26.13. Zod has no GTIN validator, `schema` is the equivalent a user would write (digits and length regexp, check digit refinement), `z.compile()` is its [ahead-of-time compiled](https://zod.dev/compile) version. Higher is better.

| Implementation | Mixed (~20% invalid) | Valid only |
| --- | --: | --: |
| `isGtin(v)` | ~44k ops/s | ~52k ops/s |
| zod: `z.compile(z.string().refine(isGtin))` | ~14k ops/s | ~40k ops/s |
| zod: `z.compile(schema).safeParse(v)` | ~4.3k ops/s | ~7.1k ops/s |
| zod: `schema.safeParse(v)` | ~4.2k ops/s | ~6.0k ops/s |

> When using zod, `z.string().refine(isGtin)` keeps most of the performance on valid values, invalid ones go through the zod error handling.

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/barcode/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/barcode/.size-limit.ts)

| Scenario (esm) | Size (brotli) |
| --- | --: |
| `import { detectBarcodeType } from '@httpx/barcode'` | ~ 290B |
| `import { isGtin } from '@httpx/barcode'` | ~ 265B |
| `import { normalizeGtin } from '@httpx/barcode'` | ~ 425B |
| `import { formatGtin } from '@httpx/barcode'` | ~ 320B |
| `import { isRestrictedCirculation } from '@httpx/barcode'` | ~ 425B |
| `import { assertNormalizedGtin } from '@httpx/barcode'` | ~ 540B |
| `import { isEan13 } from '@httpx/barcode'` | ~ 245B |
| `import { isEan8, isEan13, isGtin14, isUpcA } from '@httpx/barcode'` | ~ 265B |
| `import { assertEan13 } from '@httpx/barcode'` | ~ 385B |
| `import { assertEan8, assertEan13, assertGtin, assertGtin14, assertUpcA } from '@httpx/barcode'` | ~ 480B |

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [defaults, > 0.26%, last 2 versions, Firefox ESR, not dead](https://github.com/belgattitude/httpx/blob/main/packages/barcode/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Deno | ✅ | Tested with latest lts |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
| ES2022 | ✅ | Dist files checked with [es-check](https://github.com/yowainwright/es-check) |
| Performance | ✅ | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx) |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together! [Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>), or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
   </tr>
</table>

## License

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.
