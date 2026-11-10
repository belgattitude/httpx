# @httpx/barcode

[![npm](https://img.shields.io/npm/v/@httpx/barcode?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/barcode) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/barcode/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-barcode-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fbarcode) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/barcode/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=22%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/barcode?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/barcode) [![license](https://img.shields.io/npm/l/@httpx/barcode?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

Barcode utilities: parse, detect and validate barcodes (EAN-13, EAN-8, UPC-A, UPC-E, GTIN-14), GTIN check digits and normalization.

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

### parseGtin

Parse a barcode from any source (form input, CSV, spreadsheet, JSON or a numeric database column where leading zeros were lost) and get back its `value` in the right length, its type and its canonical GTIN-14 form. Accepts a string, a number or a bigint and never throws for invalid values (see [parseGtinOrThrow](#parsegtinorthrow)).

```typescript
import { parseGtin } from "@httpx/barcode";

const result = parseGtin(36000291452); // 👈 a UPC-A stored as a number, leading zero lost

if (result.success) {
  result.value; // 👈 "036000291452" (UpcA), the barcode to display, print or encode
  result.type; // 👈 "upca"
  result.gtin; // 👈 "00036000291452" (Gtin14), to store and compare
} else {
  result.reason; // 👈 ie: "invalid_check_digit"
}
```

Returned values:

```typescript
parseGtin("4006381333931");
// 👈 { success: true, value: "4006381333931", type: "ean13", gtin: "04006381333931", format: "ean13", indicator: 0, category: "trade_item" }

parseGtin(36000291452);
// 👈 { success: true, value: "036000291452", type: "upca", gtin: "00036000291452", format: null, indicator: 0, category: "trade_item" }

parseGtin("0036000291452"); // 👈 a UPC-A given as an EAN-13
// 👈 { success: true, value: "036000291452", type: "upca", gtin: "00036000291452", format: "ean13", indicator: 0, category: "trade_item" }

parseGtin(96385074n);
// 👈 { success: true, value: "96385074", type: "ean8", gtin: "00000096385074", format: null, indicator: 0, category: "trade_item" }

parseGtin("9781861972712"); // 👈 a book
// 👈 { success: true, value: "9781861972712", type: "ean13", gtin: "09781861972712", format: "ean13", indicator: 0, category: "isbn" }

parseGtin("10012345678902");
// 👈 { success: true, value: "10012345678902", type: "gtin14", gtin: "10012345678902", format: "gtin14", indicator: 1, category: "trade_item" }

parseGtin(" 4006381333931\r\n"); // 👈 trimmed by default
// 👈 { success: true, value: "4006381333931", type: "ean13", ... }

parseGtin(4006380000000); // 👈 { success: false, reason: "invalid_check_digit" }
parseGtin("4006-381333931"); // 👈 { success: false, reason: "invalid_format" }
parseGtin("2123456789010"); // 👈 an in-store code (restricted circulation number)
// 👈 { success: true, value: "2123456789010", type: "ean13", gtin: "02123456789010", format: "ean13", indicator: 0, category: "in_store" }
parseGtin(null); // 👈 { success: false, reason: "invalid_type" }
```

| Field | Description |
| --- | --- |
| `value` | **The barcode in the length of its `type`** (8, 12, 13 or 14 digits), leading zeros restored or removed, typed accordingly (`Ean8`, `UpcA`, `Ean13` or `Gtin14`). ie: `"036000291452"` whether given as `36000291452`, `"036000291452"` or `"0036000291452"` |
| `type` | GS1 type (`ean8`, `upca`, `ean13` or `gtin14`), from the significant digits: the same whatever the leading zeros |
| `gtin` | Canonical GTIN-14 form (`Gtin14`, left-padded with zeros), as recommended by GS1 for storage and comparison |
| `format` | Format as given, from the length of a string input (`"upce"` when read as a UPC-E, see the `upce` option). `null` for numbers, bigints and strings of other lengths (leading zeros lost) |
| `indicator` | GTIN-14 indicator digit (packaging level), `0` for trade items |
| `category` | GS1 classification from the prefix, see [categories](#categories) |

| Reason | Description |
| --- | --- |
| `invalid_type` | Not a string, number or bigint (or not listed in `inputTypes`) |
| `invalid_format` | Non digit character (whitespace too with `trim: false`), UPC-E number system other than 0 or 1 or expanding to the GTIN-8 range (with `upce: true`), negative, unsafe or non integer number, negative bigint |
| `invalid_length` | Less than `minLength` (default 8) or more than 14 digits (a UPC-E counts as its 12 digit UPC-A) |
| `invalid_check_digit` | The GS1 mod-10 check digit doesn't match |
| `invalid_barcode_type` | Valid GTIN but its `type` isn't listed in `types` |
| `format_not_accepted` | Valid GTIN but its format as given (`format`) isn't listed in `formats`, or can't be known (number, bigint, string of another length) |
| `invalid_category` | Valid GTIN but its `category` isn't listed in `categories` |

#### Options

| Option | Default | Description |
| --- | --- | --- |
| `types` | all | Accepted barcode types, matched on `type` (leading zeros don't matter) |
| `formats` | all | Accepted formats as given, matched on `format` (`ean8`, `upca`, `ean13`, `gtin14`, `upce`), ie: to exclude [UPC-E](#upc-e). Unknown formats (numbers, bigints, other lengths) are refused when set. Listing `upce` reads UPC-E like `upce: "prefer-ean8"` (unless `upce` is set) |
| `inputTypes` | all | Accepted JavaScript types of the value (`string`, `number`, `bigint`) |
| `trim` | `true` | Remove leading and trailing whitespace of strings (`String.prototype.trim`) |
| `categories` | all | Accepted [categories](#categories), ie: `["trade_item"]` to refuse books, coupons and refund receipts |
| `minLength` | `8` | Minimum number of digits of the input, as given (see [minLength](#minlength)) |
| `upce` | `false`, `"prefer-ean8"` when `formats` lists `upce` | Read 8 digit strings as [UPC-E](#upc-e) (expanded to their UPC-A) instead of EAN-8: `true` always, `"prefer-ean8"` (safest) or `"prefer-upce"` when starting with `0` and valid as UPC-E (see [UPC-E](#upc-e)) |

```typescript
// only EAN-13 and UPC-A
parseGtin("96385074", { types: ["ean13", "upca"] });
// 👈 { success: false, reason: "invalid_barcode_type" }

// only formats as given, ie: UPC-E excluded (UPC-A still accepted)
parseGtin("04252614", { upce: "prefer-ean8", formats: ["upca", "ean13"] });
// 👈 { success: false, reason: "format_not_accepted" }

// only regular products (no books, periodicals, coupons nor refund receipts)
parseGtin("9781861972712", { categories: ["trade_item"] });
// 👈 { success: false, reason: "invalid_category" }

// only strings, ie: refuse numbers and bigints (leading zeros lost)
parseGtin(36000291452, { inputTypes: ["string"] });
// 👈 { success: false, reason: "invalid_type" }

// no trimming
parseGtin(" 4006381333931", { trim: false });
// 👈 { success: false, reason: "invalid_format" }

// 8 digit strings read as UPC-E (expanded to their UPC-A)
parseGtin("04252614", { upce: true });
// 👈 { success: true, value: "042100005264", type: "upca", gtin: "00042100005264", format: "upce", ... }

// UPC-E detected: 8 digit strings starting with 0 and valid as UPC-E
parseGtin("04252614", { upce: "prefer-ean8" }); // 👈 { success: true, value: "042100005264", format: "upce", ... }
parseGtin("96385074", { upce: "prefer-ean8" }); // 👈 { success: true, value: "96385074", format: "ean8", ... }
// also a valid in-store EAN-8: kept ("prefer-ean8", safest) or expanded ("prefer-upce")
parseGtin("01234565", { upce: "prefer-ean8" }); // 👈 { success: true, value: "01234565", format: "ean8", ..., category: "in_store" }
parseGtin("01234565", { upce: "prefer-upce" }); // 👈 { success: true, value: "012345000065", format: "upce", ... }

// in-store codes (restricted circulation numbers) are accepted and flagged, refuse them with categories
parseGtin("2123456789010");
// 👈 { success: true, value: "2123456789010", type: "ean13", gtin: "02123456789010", ..., category: "in_store" }
parseGtin("2123456789010", {
  categories: ["trade_item", "isbn", "ismn", "issn"],
});
// 👈 { success: false, reason: "invalid_category" }
```

#### Categories

The `category` is read from the GS1 Prefix, on the GTIN-13 form (the digits after the GTIN-14 indicator, so a case of books is still `isbn`):

| Category | Prefix | Description |
| --- | --- | --- |
| `trade_item` | any other | Regular product |
| `isbn` | `978`, `979` (except `9790`) | Book (ISBN-13) |
| `ismn` | `9790` | Sheet music |
| `issn` | `977` | Periodical (magazine, newspaper) |
| `coupon` | `981`-`984`, `99`, `05` | Coupon (`05`: UPC-A number system 5, legacy coupons) |
| `refund_receipt` | `980` | Refund receipt (ie: bottle deposit) |
| `in_store` | see [ranges](#restricted-circulation-numbers) | [Restricted circulation number](#restricted-circulation-numbers): in-store label, variable measure item. Not a globally unique product identifier, exclude it with `categories` when only real products are expected |

#### parseGtinOrThrow

Same as `parseGtin` but returns the parsed GTIN or throws. Accepts a message or an error factory receiving the value and the reason, and the `parseGtin` options as third parameter.

```typescript
import { parseGtinOrThrow } from "@httpx/barcode";

const { value, type, gtin } = parseGtinOrThrow(36000291452);
// 👈 "036000291452", "upca", "00036000291452"

parseGtinOrThrow(4006380000000);
// 👈 throws TypeError('Value is expected to be a GTIN (invalid_check_digit), got: number')

parseGtinOrThrow(
  input,
  (v, reason) => new HttpBadRequest(`Invalid barcode: ${reason}`)
);
// 👈 throws the error returned by the factory

parseGtinOrThrow(input, undefined, { types: ["ean13", "upca"] });
```

#### createGtinParser

Create a parser with default options, reused by `parse` and `parseOrThrow`. Options are copied and validated once (a bad `minLength` throws at creation), and the result types are narrowed from `types`, `formats` and `categories`. It also takes an `errorFactory` used by `parseOrThrow`.

```typescript
import { createGtinParser } from "@httpx/barcode";

export const gtinParser = createGtinParser({
  types: ["ean13", "upca"],
  categories: ["trade_item"],
  errorFactory: (v, reason) => new HttpBadRequest(`Invalid barcode: ${reason}`),
});

const result = gtinParser.parse(input);
if (result.success) {
  result.value; // 👈 Ean13 | UpcA (narrowed from `types`)
  result.category; // 👈 "trade_item" (narrowed from `categories`)
}

const { value, gtin } = gtinParser.parseOrThrow(input); // 👈 throws HttpBadRequest

// parse and parseOrThrow take a single argument and don't depend on `this`
const results = codes.map(gtinParser.parse);

// a new parser with options merged over the current ones
const withInStoreParser = gtinParser.extend({
  categories: ["trade_item", "in_store"],
});
```

> `types` matches the GS1 type (a UPC-E or a 13 digit `0036000291452` are `upca`), `formats` the format as given (`format`: `upce`, `ean13`).

> The result types (`type`, `value`, `format` and `category`) are narrowed from options given as literals. Options typed as `GtinParserOptions` (ie: loaded from a config) give the full types.

> Performance: on valid codes `parseGtin` is ~45-50% slower than [normalizeGtin](#normalizegtin) (result object, type and category), on node. Throwing is costly (error and stack trace creation): with ~20% invalid codes, `parseGtinOrThrow` in a try/catch is ~25x slower than `parseGtin` on node (~3x on bun): prefer `parseGtin` when invalid values are expected, ie: bulk imports. See the [benchmark](https://github.com/belgattitude/httpx/blob/main/packages/barcode/bench/parse-gtin.bench.ts).

### detectBarcodeType

Detect the type of a barcode string: `ean8`, `upca`, `ean13` or `gtin14` (or `upce` with the `upce` option), based on its length (no leading zeros handling, see [parseGtin](#parsegtin)). Returns `null` when the length isn't supported, the code contains anything other than digits, or the check digit is invalid. Like [parseGtin](#parsegtin), [restricted circulation numbers](#restricted-circulation-numbers) (in-store codes) are detected: use [isInStoreGtin](#isinstoregtin) to tell them apart. Like the typeguards, it validates the value as is (never trimmed): use [parseGtin](#parsegtin) for untrusted input.

```typescript
import { detectBarcodeType, type BarcodeType } from "@httpx/barcode";

detectBarcodeType("96385074"); // 👈 "ean8"
detectBarcodeType("036000291452"); // 👈 "upca"
detectBarcodeType("4006381333931"); // 👈 "ean13"
detectBarcodeType("10012345678902"); // 👈 "gtin14"
detectBarcodeType("4006381333932"); // 👈 null (invalid check digit)
detectBarcodeType(" 4006381333931"); // 👈 null (never trimmed)
detectBarcodeType("2123456789010"); // 👈 "ean13" (in-store code, restricted circulation)

// UPC-E (the return type includes "upce" only with the option)
detectBarcodeType("04252614"); // 👈 null (invalid EAN-8 check digit)
detectBarcodeType("04252614", { upce: "prefer-ean8" }); // 👈 "upce"
detectBarcodeType("96385074", { upce: "prefer-ean8" }); // 👈 "ean8"
detectBarcodeType("01234565", { upce: "prefer-ean8" }); // 👈 "ean8" (also an in-store EAN-8, kept)
detectBarcodeType("01234565", { upce: "prefer-upce" }); // 👈 "upce"
detectBarcodeType("10000168", { upce: true }); // 👈 "upce"
```

> A 13-digit code starting with `0` (an UPC-A expressed as EAN-13) is detected as `ean13`, [parseGtin](#parsegtin) gives its GS1 type (`upca`). 8 digits are detected as `ean8` unless the `upce` option is set (see [UPC-E](#upc-e)).

### Typeguards

`isEan13`, `isEan8`, `isUpcA`, `isGtin14` and `isUpcE` ([UPC-E](#upc-e)) accept any value (`unknown`) and narrow it to a branded string type (`Ean13`, `Ean8`, `UpcA`, `Gtin14`, `UpcE`) when it has the right length, only digits and a valid check digit. `isGtin` narrows to `Gtin` (any of them). [Restricted circulation numbers](#restricted-circulation-numbers) (in-store codes) are valid: use [isInStoreGtin](#isinstoregtin) to tell them apart.

```typescript
import { isEan13, isGtin, isGtin14, type Ean13 } from "@httpx/barcode";

const saveProduct = (ean: Ean13) => {
  /* ... */
};

const value: unknown = "4006381333931";

if (isEan13(value)) {
  saveProduct(value); // 👈 value is Ean13
}

saveProduct("4006381333931"); // 👈 TS error: a plain string is not an Ean13

isGtin("4006381333931"); // 👈 true (any GTIN length)
isGtin("4006381333932"); // 👈 false (invalid check digit)
isGtin14("10012345678902"); // 👈 true
isGtin14(10012345678902); // 👈 false (not a string)
isEan13(" 4006381333931"); // 👈 false (never trimmed)
isEan13("2123456789010"); // 👈 true (in-store code, see isInStoreGtin)
["4006381333931", "x"].filter(isEan13); // 👈 ["4006381333931"] (Ean13[])
```

> Typeguards and assertions never trim nor restore leading zeros: they narrow the value as is. Use [parseGtin](#parsegtin) for untrusted input.

> They take a single argument: safe to pass to array methods, `codes.filter(isEan13)` gives an `Ean13[]`.

> Branded types are compile-time only. A branded value is still a `string` (assignable to `string`), but a plain `string` must go through a typeguard to become one.

### Assertions

`assertEan13`, `assertEan8`, `assertUpcA`, `assertGtin14`, `assertUpcE` and `assertGtin` narrow the value like their typeguard counterparts but throw when it's invalid. By default they throw a `TypeError` that describes the value without leaking its content.

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
| `assertUpcE(v, msgOrErrorFactory?)` | `UpcE` | `Value is expected to be a UPC-E, got: …` |
| `assertGtin(v, msgOrErrorFactory?)` | `Gtin` | `Value is expected to be a GTIN, got: …` |

### formatGtin

Format a valid GTIN to another length (8, 12, 13 or 14) by adding or removing leading zeros, ie: to display a stored GTIN-14. Returns `null` if the input isn't a valid GTIN or if a non-zero digit would be removed. The result is typed according to the length (`Ean8`, `UpcA`, `Ean13` or `Gtin14`). Leading and trailing whitespace is trimmed unless `{ trim: false }`.

```typescript
import { formatGtin } from "@httpx/barcode";

formatGtin("00036000291452", 12); // 👈 "036000291452" (UpcA)
formatGtin("00036000291452", 13); // 👈 "0036000291452" (Ean13)
formatGtin("96385074", 14); // 👈 "00000096385074" (Gtin14)
formatGtin("04006381333931", 12); // 👈 null (would drop the "4")
formatGtin(" 036000291452\n", 14); // 👈 "00036000291452" (trimmed)
```

### UPC-E

UPC-E is the zero-suppressed form of a UPC-A, printed on small packages: 8 digits (number system `0` or `1`, 6 digits and the check digit of the UPC-A). It's not a GTIN by itself: its GTIN is the expanded UPC-A, ie: `04252614` is the UPC-A `042100005264`.

> An 8 digit value can be both a valid UPC-E and a valid EAN-8 (ie: `10000168`): only the source (ie: the scanner symbology) tells which one it is. 8 digits are read as EAN-8 unless asked otherwise, with the `upce` option of `parseGtin`, `createGtinParser` and `detectBarcodeType`:
>
> - `upce: true`: always read as UPC-E, when the source is known to be UPC-E.
> - `upce: "prefer-ean8"` or `"prefer-upce"`: detected. Read as UPC-E when it starts with `0` and is a valid UPC-E, as EAN-8 otherwise. `0` is the UPC-E number system of the GS1 General Specifications, and an EAN-8 starting with `0` is [restricted circulation](#restricted-circulation-numbers) (ie: an in-store code): a regular EAN-8 is never read as UPC-E.

The same 8 digits starting with `0` can be both a valid UPC-E and an in-store EAN-8 with a valid check digit (58% of the UPC-E: always when it ends, before its check digit, with 5 to 9). The digits can't tell which one it is, the two modes differ on those:

| Mode | UPC-E that is also a restricted EAN-8 | UPC-E detected | In-store EAN-8 expanded to a UPC-A |
| --- | --- | --- | --- |
| `"prefer-ean8"` (safest) | Kept as EAN-8 (`parseGtin`: `category: "in_store"`) | 42%, the ones that can't be an EAN-8 | Never |
| `"prefer-upce"` | Read as UPC-E | All | Possible: 58% of the ones starting with `0` (the UPC-A of another product) |
| `true` | Read as UPC-E (as every 8 digits) | All, number system `1` included | Yes, when the source isn't UPC-E |

Use `upce: true` / `false` from the scanner symbology when it's known, `"prefer-ean8"` when in-store codes can be mixed in (an 8 digit `in_store` EAN-8 starting with `0` can then be either), `"prefer-upce"` only for sources without in-store codes (ie: supplier catalogs). UPC-E with the number system `1` (a scanner extension, ie: `10000168`) are only read with `upce: true`.

```typescript
import {
  compressUpcA,
  detectBarcodeType,
  expandUpcE,
  isUpcE,
  parseGtin,
} from "@httpx/barcode";

isUpcE("04252614"); // 👈 true (number system, check digit of the UPC-A)
expandUpcE("04252614"); // 👈 "042100005264" (UpcA)
compressUpcA("042100005264"); // 👈 "04252614" (UpcE)
compressUpcA("00042100005264"); // 👈 "04252614" (any GTIN form of the UPC-A)
compressUpcA("036000291452"); // 👈 null (no suppressible zeros)
compressUpcA("10000007"); // 👈 null (EAN-8, no UPC-A form)

parseGtin("04252614", { upce: true });
// 👈 { success: true, value: "042100005264", type: "upca", gtin: "00042100005264", format: "upce", ... }
parseGtin("04252614", { upce: "prefer-ean8" }); // 👈 same (starts with 0, valid UPC-E, can't be an EAN-8)
parseGtin("01234565", { upce: "prefer-ean8" }); // 👈 { success: true, value: "01234565", type: "ean8", format: "ean8", ..., category: "in_store" } (also an in-store EAN-8, kept)
parseGtin("01234565", { upce: "prefer-upce" }); // 👈 { success: true, value: "012345000065", type: "upca", format: "upce", ... }
parseGtin("10000168", { upce: "prefer-upce" }); // 👈 { success: true, value: "10000168", type: "ean8", format: "ean8", ... } (number system 1)
detectBarcodeType("04252614", { upce: "prefer-ean8" }); // 👈 "upce"

// exclude UPC-E (or accept only UPC-E) with formats, matched on format
parseGtin("04252614", { upce: "prefer-ean8", formats: ["upca", "ean13"] }); // 👈 { success: false, reason: "format_not_accepted" }
parseGtin("042100005264", { upce: true, formats: ["upce"] }); // 👈 { success: false, reason: "format_not_accepted" }
parseGtin("04252614", { formats: ["upce"] }); // 👈 { success: true, value: "042100005264", format: "upce", ... } (upce: "prefer-ean8" implied)

// the format tells if the value was given as a UPC-E
const result = parseGtin("04252614", { upce: "prefer-ean8" });
if (result.success && result.format === "upce") {
  result.value; // 👈 "042100005264", the expanded UPC-A
}
```

`expandUpcE` and `compressUpcA` return `null` for invalid values and trim strings unless `{ trim: false }`. A UPC-E is never a restricted circulation number. A UPC-A starting with `0000` is in the GTIN-8 range (the same GTIN as an EAN-8, ie: `000010000007` is the EAN-8 `10000007`): it has no UPC-E, and a UPC-E expanding to it is refused. With `parseGtin`, `minLength` counts a UPC-E as its 12 digit UPC-A. Numbers are never read as UPC-E (the number system digit would be lost), pass a string.

### isInStoreGtin

Tells if a GTIN is an in-store code, a GS1 Restricted Circulation Number (RCN, the `in_store` category of [parseGtin](#parsegtin)): a code only meaningful within a company or a geographic region (ie: in-store labels, variable measure items with an embedded weight or price), not a globally unique product identifier. The other functions accept them as valid GTINs (see [restricted circulation numbers](#restricted-circulation-numbers)), this one tells them apart.

```typescript
import { isInStoreGtin } from "@httpx/barcode";

isInStoreGtin("2123456789010"); // 👈 true (EAN-13 starting with 2)
isInStoreGtin("0412345678903"); // 👈 true (EAN-13 starting with 04)
isInStoreGtin("212345678992"); // 👈 true (UPC-A starting with 2)
isInStoreGtin(212345678909); // 👈 true ("0212345678909", leading zero lost)
isInStoreGtin(" 2123456789010"); // 👈 false (not trimmed by default)
isInStoreGtin(" 2123456789010", { trim: true }); // 👈 true
isInStoreGtin("4006381333931"); // 👈 false
isInStoreGtin("2123456789011"); // 👈 false (invalid check digit)
```

It accepts the same values and options as [normalizeGtin](#normalizegtin) (string, number or bigint, `minLength`), except `trim` that is off by default as it returns a boolean, not the value (opt-in with `{ trim: true }`) and returns `false` for anything that isn't a GTIN with a valid check digit.

### Restricted circulation numbers

GS1 reserves some ranges for Restricted Circulation Numbers (RCN): codes only meaningful within a company or a geographic region (ie: in-store labels, variable measure items with an embedded weight or price), not globally unique product identifiers. They are valid GTINs (digits, length and check digit): every function **accepts** them, and it's up to the application to decide what to do with them:

- `parseGtin` (and `createGtinParser`) reports them with `category: "in_store"`, and refuses them with `categories`, ie: `categories: ["trade_item"]` (reason `invalid_category`).
- [isInStoreGtin](#isinstoregtin) tells them apart for the other functions (guards, assertions, `detectBarcodeType`, `normalizeGtin`, `formatGtin`).

| Code | Restricted circulation ranges |
| --- | --- |
| EAN-8 | starting with `0` or `2` |
| EAN-13 | starting with `02` or `20`-`29` (geographic region), `04` (company internal) |
| UPC-A | starting with `2` or `4` (same ranges, as an EAN-13 they start with `02` / `04`) |
| GTIN-14 | containing one of the above (digits after the indicator) |

The rule is applied on the 14 digits form, so a restricted code is recognized once padded or with its leading zeros lost:

```typescript
parseGtin("2123456789010"); // 👈 { success: true, ..., category: "in_store" }
parseGtin(212345678909); // 👈 { success: true, value: "212345678909", type: "upca", ..., category: "in_store" } ("0212345678909", leading zero lost)
parseGtin("2123456789010", { categories: ["trade_item"] }); // 👈 { success: false, reason: "invalid_category" }
isInStoreGtin("000021234569"); // 👈 true (the EAN-8 "21234569" padded as UPC-A)
isEan13("2123456789010"); // 👈 true
normalizeGtin("2123456789010"); // 👈 "02123456789010"
detectBarcodeType("212345678992"); // 👈 "upca"

// only real products with a guard
const isProduct = (v: unknown) => isGtin(v) && !isInStoreGtin(v);
```

An in-store code is not a product identifier: the same number can be another product in another store. Refuse them (or handle them apart) before a lookup in a product database.

### normalizeGtin

Lightweight alternative to [parseGtin](#parsegtin) when only the canonical form is needed. GTINs are identifiers, not numbers: once stored as a number (JSON, spreadsheets, CSV, numeric database columns) the leading zeros are lost and `036000291452` (UPC-A) becomes `36000291452`. `normalizeGtin` accepts a string, a number or a bigint and returns the canonical 14 digits form (left-padded with zeros, as recommended by GS1 for storage and comparison), or `null` if invalid. The check digit isn't affected by the padding.

```typescript
import { normalizeGtin } from "@httpx/barcode";

normalizeGtin(36000291452); // 👈 "00036000291452"
normalizeGtin("036000291452"); // 👈 "00036000291452" (UPC-A)
normalizeGtin("0036000291452"); // 👈 "00036000291452" (same product, EAN-13)
normalizeGtin(4006381333931n); // 👈 "04006381333931"
normalizeGtin(" 4006381333931\n"); // 👈 "04006381333931" (trimmed)
normalizeGtin(" 4006381333931", { trim: false }); // 👈 null
normalizeGtin(4006380000000); // 👈 null (ie: excel "4.00638E+12", invalid check digit)
normalizeGtin(-1); // 👈 null (only non-negative safe integers)
```

The returned value is typed as `Gtin14`. Strings must contain only digits (no separators), leading and trailing whitespace is trimmed unless `{ trim: false }`. Numbers must be non-negative safe integers. [Restricted circulation numbers](#restricted-circulation-numbers) (in-store codes) are valid GTINs, see [isInStoreGtin](#isinstoregtin).

#### minLength

`minLength` (default `8`, the shortest GTIN) is the minimum number of digits of the input as given (leading zeros of strings are counted). A value with less than 8 significant digits is an [EAN-8 starting with 0](#restricted-circulation-numbers) (an in-store code): lowering `minLength` accepts the ones stored as numbers (leading zeros lost), but also 1 in 10 of any small number (the check digit is the only validation left). The option is mostly useful to raise the minimum, ie: to refuse EAN-8:

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

assertNormalizedGtin(input, () => new HttpBadRequest("Invalid barcode"));
// 👈 throws the error returned by the factory

assertNormalizedGtin(input, undefined, { minLength: 12 });
```

## Benchmarks

Validation of 1000 generated codes (mostly ean13) with `isGtin(v)` compared to [zod](https://zod.dev) 4.6.7, on Node 26.13. Zod has no GTIN validator, `schema` is the equivalent a user would write (digits and length regexp, check digit refinement), `z.compile()` is its [ahead-of-time compiled](https://zod.dev/compile) version. Higher is better.

| Implementation | Mixed (~20% invalid) | Valid only |
| --- | --: | --: |
| `isGtin(v)` | ~44k ops/s | ~52k ops/s |
| zod: `z.compile(z.string().refine((v) => isGtin(v)))` | ~14k ops/s | ~40k ops/s |
| zod: `z.compile(schema).safeParse(v)` | ~4.3k ops/s | ~7.1k ops/s |
| zod: `schema.safeParse(v)` | ~4.2k ops/s | ~6.0k ops/s |

> When using zod, `z.string().refine((v) => isGtin(v))` keeps most of the performance on valid values, invalid ones go through the zod error handling.

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/barcode/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/barcode/.size-limit.ts)

| Scenario (esm) | Size (brotli) |
| --- | --: |
| `import { parseGtin } from '@httpx/barcode'` | ~ 1.46KB |
| `import { parseGtinOrThrow } from '@httpx/barcode'` | ~ 1.57KB |
| `import { createGtinParser } from '@httpx/barcode'` | ~ 1.73KB |
| `import { detectBarcodeType } from '@httpx/barcode'` | ~ 460B |
| `import { isGtin } from '@httpx/barcode'` | ~ 185B |
| `import { isEan13 } from '@httpx/barcode'` | ~ 175B |
| `import { isEan8, isEan13, isGtin14, isUpcA } from '@httpx/barcode'` | ~ 190B |
| `import { assertEan13 } from '@httpx/barcode'` | ~ 315B |
| `import { assertEan8, assertEan13, assertGtin, assertGtin14, assertUpcA } from '@httpx/barcode'` | ~ 415B |
| `import { isUpcE } from '@httpx/barcode'` | ~ 200B |
| `import { assertUpcE } from '@httpx/barcode'` | ~ 340B |
| `import { expandUpcE } from '@httpx/barcode'` | ~ 400B |
| `import { compressUpcA } from '@httpx/barcode'` | ~ 500B |
| `import { formatGtin } from '@httpx/barcode'` | ~ 325B |
| `import { isInStoreGtin } from '@httpx/barcode'` | ~ 515B |
| `import { normalizeGtin } from '@httpx/barcode'` | ~ 415B |
| `import { assertNormalizedGtin } from '@httpx/barcode'` | ~ 555B |

## Upgrade

> Refer to the [UPGRADE.md](https://github.com/belgattitude/httpx/blob/main/packages/barcode/UPGRADE.md) for detailed information.

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [defaults, > 0.28%, last 2 versions, Firefox ESR, not dead, not ios <= 15](https://github.com/belgattitude/httpx/blob/main/packages/barcode/.browserslistrc) |
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

If my OSS work brightens your day, let's take it to new heights together! [Sponsor](https://github.com/sponsors/belgattitude), [coffee](https://ko-fi.com/belgattitude), or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

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
