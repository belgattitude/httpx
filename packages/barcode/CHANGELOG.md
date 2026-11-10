# @httpx/barcode

## 0.4.0

### Minor Changes

- [#2933](https://github.com/belgattitude/httpx/pull/2933) [`f115235`](https://github.com/belgattitude/httpx/commit/f11523543be0800437b5fa3f4c2b79ab2f85cf3d) Thanks [@belgattitude](https://github.com/belgattitude)! - Detect UPC-E: `upce: "prefer-ean8"` and `upce: "prefer-upce"` options for `parseGtin` and `createGtinParser`, and `upce` option (`true`, `"prefer-ean8"` or `"prefer-upce"`) for `detectBarcodeType`.
  
  With both, an 8 digit string is read as UPC-E when it starts with `0` (the UPC-E number system of the GS1 General Specifications) and is a valid UPC-E, as EAN-8 otherwise. An EAN-8 starting with `0` is restricted circulation (ie: an in-store code), so a regular EAN-8 is never read as UPC-E. But the same 8 digits can be both a valid UPC-E and an in-store EAN-8 with a valid check digit (58% of the UPC-E), the modes differ on those:
  
  - `"prefer-ean8"` (safest): kept as EAN-8 (`category: "in_store"` with `parseGtin`). An in-store code is never expanded to a UPC-A, but only the UPC-E that can't be an EAN-8 (42%) are detected.
  - `"prefer-upce"`: read as UPC-E. Every UPC-E is detected, but an in-store EAN-8 starting with `0` can be expanded to the UPC-A of another product: only for sources without in-store codes.
  
  UPC-E with the number system `1` (ie: `10000168`) are only read with `upce: true`. Defaults are unchanged (8 digits read as EAN-8).
  
  `detectBarcodeType` returns `"upce"` only with the `upce` option: its return type stays `BarcodeType | null` without it.
  
  ```typescript
  parseGtin("04252614", { upce: "prefer-ean8" });
  // 👈 { success: true, value: "042100005264", type: "upca", gtin: "00042100005264", format: "upce", ... }
  parseGtin("01234565", { upce: "prefer-ean8" });
  // 👈 { success: true, value: "01234565", type: "ean8", format: "ean8", ..., category: "in_store" } (also an in-store EAN-8, kept)
  parseGtin("01234565", { upce: "prefer-upce" });
  // 👈 { success: true, value: "012345000065", type: "upca", format: "upce", ... }
  
  detectBarcodeType("04252614"); // 👈 null (invalid EAN-8 check digit)
  detectBarcodeType("04252614", { upce: "prefer-ean8" }); // 👈 "upce"
  detectBarcodeType("10000168", { upce: true }); // 👈 "upce"
  ```
  
  Add a `formats` option to `parseGtin` and `createGtinParser`: accepted formats as given, matched on `format` (`ean8`, `upca`, `ean13`, `gtin14`, `upce`), refused with the new `format_not_accepted` reason (checked after `invalid_barcode_type`). Unlike `types` (the GS1 type, where a UPC-E is a `upca`), it can exclude or require UPC-E. Values whose format can't be known (numbers, bigints, strings of other lengths) are refused when it's set. `createGtinParser` narrows `format` from it. Listing `"upce"` reads UPC-E like `upce: "prefer-ean8"`, unless `upce` is set.
  
  ```typescript
  parseGtin("04252614", { upce: "prefer-ean8", formats: ["upca", "ean13"] });
  // 👈 { success: false, reason: "format_not_accepted" }
  parseGtin("0036000291452", { formats: ["ean13"] });
  // 👈 { success: true, value: "036000291452", type: "upca", format: "ean13", ... }
  ```
  
  UPC-E are now validated on their 8 digits, without expanding them to the UPC-A: `isUpcE` is ~6x faster and nothing is allocated for invalid values (`expandUpcE`, `assertUpcE`).
  
  **Breaking**: the `inputType` field of the `parseGtin` result is renamed to `format` (matched by the `formats` option, and no longer confused with the `inputTypes` option, the JavaScript types). `format: "upce"` tells the value was given as a UPC-E.
  
  **Breaking**: restricted circulation numbers (in-store codes: in-store labels, variable measure items with an embedded weight or price) are now accepted by every function, as the valid GTINs they are (digits, length and check digit). The `acceptRestricted` option and the `GtinValidationOptions` type are removed from `parseGtin`, `parseGtinOrThrow`, `createGtinParser`, `detectBarcodeType`, the guards (`isGtin`, `isEan13`, `isEan8`, `isUpcA`, `isGtin14`, `isUpcE`), the assertions, `normalizeGtin`, `assertNormalizedGtin`, `formatGtin`, `expandUpcE` and `compressUpcA`.
  
  - `parseGtin` reports them with the category `in_store` (renamed from `restricted`), the `restricted` failure reason is removed. Refuse them with `categories`, ie: `categories: ["trade_item"]` (reason `invalid_category`).
  - For the other functions, `isInStoreGtin` tells them apart: `isGtin(v) && !isInStoreGtin(v)`.
  - Guards take a single argument: `codes.filter(isEan13)` is safe. Assertions lose their third argument (`options`).
  - With `minLength` lowered under 8, `normalizeGtin` and `parseGtin` accept values with less than 8 significant digits (in-store EAN-8 starting with 0 stored as numbers).
  
  ```typescript
  parseGtin("2123456789010");
  // 👈 { success: true, value: "2123456789010", type: "ean13", ..., category: "in_store" }
  parseGtin("2123456789010", { categories: ["trade_item"] });
  // 👈 { success: false, reason: "invalid_category" }
  detectBarcodeType("2123456789010"); // 👈 "ean13" (was null)
  isEan13("2123456789010"); // 👈 true (was false)
  normalizeGtin("2123456789010"); // 👈 "02123456789010" (was null)
  isInStoreGtin("2123456789010"); // 👈 true
  ```
  
  **Breaking**: `isRestrictedCirculation` is renamed to `isInStoreGtin` (and `IsRestrictedCirculationOptions` to `IsInStoreGtinOptions`), like the `in_store` category of `parseGtin`.
  
  See [UPGRADE.md](https://github.com/belgattitude/httpx/blob/main/packages/barcode/UPGRADE.md) for the migration of the breaking changes.

## 0.3.0

### Minor Changes

- [#2919](https://github.com/belgattitude/httpx/pull/2919) [`933019c`](https://github.com/belgattitude/httpx/commit/933019ce7a01259d219e836633a011613adb8799) Thanks [@belgattitude](https://github.com/belgattitude)! - Add `parseGtin`, `parseGtinOrThrow` and `createGtinParser`, and trim strings by default in the functions returning a value.
  
  #### parseGtin
  
  Parse a barcode from any source (form input, CSV, spreadsheet, JSON or a numeric database column where leading zeros were lost) and get back its `value` in the right length, its type and its canonical GTIN-14 form. Accepts a string, a number or a bigint and never throws for invalid values.
  
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
  // 👈 { success: true, value: "4006381333931", type: "ean13", gtin: "04006381333931", inputType: "ean13", indicator: 0, category: "trade_item" }
  
  parseGtin("0036000291452"); // 👈 a UPC-A given as an EAN-13
  // 👈 { success: true, value: "036000291452", type: "upca", gtin: "00036000291452", inputType: "ean13", indicator: 0, category: "trade_item" }
  
  parseGtin(96385074n);
  // 👈 { success: true, value: "96385074", type: "ean8", gtin: "00000096385074", inputType: null, indicator: 0, category: "trade_item" }
  
  parseGtin(" 4006381333931\r\n"); // 👈 trimmed by default
  // 👈 { success: true, value: "4006381333931", type: "ean13", ... }
  
  parseGtin(4006380000000); // 👈 { success: false, reason: "invalid_check_digit" }
  parseGtin("2123456789010"); // 👈 { success: false, reason: "restricted" }
  ```
  
  - `value`: the barcode in the length of its `type` (8, 12, 13 or 14 digits), leading zeros restored or removed, typed accordingly (`Ean8`, `UpcA`, `Ean13` or `Gtin14`).
  - `type`: GS1 type from the significant digits, the same whatever the leading zeros.
  - `gtin`: canonical GTIN-14 form (`Gtin14`), as recommended by GS1 for storage and comparison.
  - `inputType`: type as given (string length), `null` for numbers and bigints.
  - `indicator`: GTIN-14 indicator digit (packaging level).
  - `category`: GS1 classification from the prefix: `trade_item`, `isbn` (978, 979), `ismn` (9790), `issn` (977), `coupon` (981-984, 99, 05), `refund_receipt` (980) or `restricted` (only with `acceptRestricted`).
  - Failure reasons: `invalid_type`, `invalid_format`, `invalid_length`, `invalid_check_digit`, `restricted`, `invalid_barcode_type` and `invalid_category`.
  
  Options: `types` (accepted barcode types), `categories` (accepted categories), `inputTypes` (accepted JavaScript types), `trim` (default `true`), `acceptRestricted` (default `false`) and `minLength` (default `8`).
  
  ```typescript
  parseGtin("96385074", { types: ["ean13", "upca"] }); // 👈 { success: false, reason: "invalid_barcode_type" }
  parseGtin("9781861972712"); // 👈 { success: true, ..., category: "isbn" }
  parseGtin("9781861972712", { categories: ["trade_item"] }); // 👈 { success: false, reason: "invalid_category" }
  parseGtin(36000291452, { inputTypes: ["string"] }); // 👈 { success: false, reason: "invalid_type" }
  ```
  
  `parseGtinOrThrow` returns the parsed GTIN or throws, the error factory receives the value and the reason:
  
  ```typescript
  const { value, type, gtin } = parseGtinOrThrow(
    input,
    (v, reason) => new HttpBadRequest(reason)
  );
  ```
  
  #### createGtinParser
  
  A parser with default options (validated once), result types narrowed from `types`, `categories` and `acceptRestricted`, and a default `errorFactory` for `parseOrThrow`:
  
  ```typescript
  import { createGtinParser } from "@httpx/barcode";
  
  export const gtinParser = createGtinParser({
    types: ["ean13", "upca"],
    categories: ["trade_item"],
    errorFactory: (v, reason) => new HttpBadRequest(`Invalid barcode: ${reason}`),
  });
  
  const result = gtinParser.parse(input); // 👈 result.value: Ean13 | UpcA
  const { value, gtin } = gtinParser.parseOrThrow(input); // 👈 throws HttpBadRequest
  const results = codes.map(gtinParser.parse); // 👈 single argument, no `this`
  const lenientParser = gtinParser.extend({ acceptRestricted: true });
  ```
  
  #### trim option
  
  **Behavior change**: `normalizeGtin`, `assertNormalizedGtin` and `formatGtin` now trim leading and trailing whitespace of strings by default (`String.prototype.trim`, ie: values from CSV or spreadsheets). Pass `{ trim: false }` to keep the previous behavior:
  
  ```typescript
  normalizeGtin(" 4006381333931\n"); // 👈 "04006381333931" (was null)
  normalizeGtin(" 4006381333931", { trim: false }); // 👈 null
  ```
  
  Typeguards, assertions (`isGtin`, `isEan13`, `assertEan13`...) and `detectBarcodeType` never trim: they validate the value as is, a string with whitespace can't be typed as `Ean13`. `isRestrictedCirculation` only trims with `{ trim: true }` (it returns a boolean, not the value). Use `parseGtin` for untrusted input.

- [#2919](https://github.com/belgattitude/httpx/pull/2919) [`933019c`](https://github.com/belgattitude/httpx/commit/933019ce7a01259d219e836633a011613adb8799) Thanks [@belgattitude](https://github.com/belgattitude)! - Add UPC-E support: `isUpcE`, `assertUpcE`, `expandUpcE`, `compressUpcA` and the `upce` option of `parseGtin`.
  
  UPC-E is the zero-suppressed form of a UPC-A (8 digits, number system `0` or `1`, check digit of the UPC-A). Its GTIN is the expanded UPC-A. UPC-A starting with `0000` (the GTIN-8 range, same GTIN as an EAN-8) have no UPC-E. With `parseGtin`, `minLength` counts a UPC-E as its 12 digit UPC-A. As an 8 digit value can be both a valid UPC-E and a valid EAN-8, 8 digits are still read as EAN-8 unless asked otherwise.
  
  ```typescript
  isUpcE("04252614"); // 👈 true
  expandUpcE("04252614"); // 👈 "042100005264" (UpcA)
  compressUpcA("00042100005264"); // 👈 "04252614" (UpcE)
  
  parseGtin("04252614", { upce: true });
  // 👈 { success: true, value: "042100005264", type: "upca", gtin: "00042100005264", inputType: "upce", indicator: 0, category: "trade_item" }
  ```

## 0.2.0

### Minor Changes

- [#2912](https://github.com/belgattitude/httpx/pull/2912) [`1be7330`](https://github.com/belgattitude/httpx/commit/1be7330c68230fac3243a26d6353a5f67f82e985) Thanks [@belgattitude](https://github.com/belgattitude)! - Refuse all GS1 restricted circulation numbers by default, add the `acceptRestricted` option and improve performance.
  
  **Breaking**: restricted circulation EAN-13 (`02`, `04`, `20`-`29`), UPC-A (`2`, `4`) and the GTIN-14 containing them are now refused by default, like restricted EAN-8 (`0`, `2`) already were. Pass `{ acceptRestricted: true }` to accept them (EAN-8 included):
  
  ```typescript
  isEan13("2123456789010"); // 👈 false
  isEan13("2123456789010", { acceptRestricted: true }); // 👈 true
  detectBarcodeType("212345678992", { acceptRestricted: true }); // 👈 "upca"
  normalizeGtin(21234569, { acceptRestricted: true }); // 👈 "00000021234569"
  formatGtin("2123456789010", 14, { acceptRestricted: true });
  assertEan13(v, undefined, { acceptRestricted: true });
  ```
  
  As the guards now take options, use an arrow function with array methods: `codes.filter((c) => isEan13(c))`.
  
  Performance: faster check digit validation (`charCodeAt`, single comparison range check), cheaper restricted range check done before the check digit loop, and `normalizeGtin` validates before padding (~2x faster).

## 0.1.0

### Minor Changes

- [`0538a76`](https://github.com/belgattitude/httpx/commit/0538a76069b9e73ff946e7230e2a376286a1fe29) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial release of @httpx/barcode
