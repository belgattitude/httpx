---
"@httpx/barcode": minor
---

Add `parseGtin`, `parseGtinOrThrow` and `createGtinParser`, and trim strings by default in the functions returning a value.

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

**Behavior change**: `normalizeGtin`, `assertNormalizedGtin`, `isRestrictedCirculation`, `detectBarcodeType` and `formatGtin` now trim leading and trailing whitespace of strings by default (`String.prototype.trim`, ie: values from CSV or spreadsheets). Pass `{ trim: false }` to keep the previous behavior:

```typescript
normalizeGtin(" 4006381333931\n"); // 👈 "04006381333931" (was null)
normalizeGtin(" 4006381333931", { trim: false }); // 👈 null
detectBarcodeType(" 4006381333931"); // 👈 "ean13" (was null)
```

Typeguards and assertions (`isGtin`, `isEan13`, `assertEan13`...) never trim: they narrow the value as is, a string with whitespace can't be typed as `Ean13`. Use `parseGtin` for untrusted input.
