## Upgrade

### Breaking changes in v0.4

- [In-store codes are accepted by every function](#in-store-codes-are-accepted-by-every-function), the `acceptRestricted` option is removed.
- [isRestrictedCirculation is renamed to isInStoreGtin](#isrestrictedcirculation-is-renamed-to-isinstoregtin).
- [parseGtin: inputType is renamed to format](#parsegtin-inputtype-is-renamed-to-format).
- [parseGtin: failure reasons](#parsegtin-failure-reasons).

#### In-store codes are accepted by every function

In-store codes are the GS1 restricted circulation numbers: codes only meaningful within a company or a geographic region (in-store labels, variable measure items with an embedded weight or price). They are valid GTINs (digits, length and check digit), not globally unique product identifiers.

Up to v0.3 they were refused unless `{ acceptRestricted: true }`. From v0.4 **every function accepts them** and it's up to the application to refuse them when only real products are expected. The `acceptRestricted` option and the `GtinValidationOptions` type are removed.

| Function | v0.3 | v0.4 |
| --- | --- | --- |
| `parseGtin`, `parseGtinOrThrow`, `createGtinParser` | `{ success: false, reason: "restricted" }` | `{ success: true, ..., category: "in_store" }` |
| `detectBarcodeType` | `null` | its type, ie: `"ean13"` |
| `isGtin`, `isEan13`, `isEan8`, `isUpcA`, `isGtin14` | `false` | `true` |
| `assertGtin`, `assertEan13`, `assertEan8`, `assertUpcA`, `assertGtin14` | throws | doesn't throw |
| `normalizeGtin`, `formatGtin` | `null` | the GTIN |
| `assertNormalizedGtin` | throws | the GTIN |

> Passing `acceptRestricted` is a TypeScript error. In plain JavaScript it's silently ignored: review the calls relying on the default refusal, they don't fail anymore.

##### If you passed acceptRestricted: true

Remove the option, the behaviour is the same. With `parseGtin` the category is now `in_store` instead of `restricted`.

```typescript
// before
parseGtin("2123456789010", { acceptRestricted: true }); // 👈 { success: true, ..., category: "restricted" }
isEan13("2123456789010", { acceptRestricted: true }); // 👈 true
assertGtin(v, undefined, { acceptRestricted: true });
normalizeGtin(v, { acceptRestricted: true });
detectBarcodeType(v, { acceptRestricted: true });

// after
parseGtin("2123456789010"); // 👈 { success: true, ..., category: "in_store" }
isEan13("2123456789010"); // 👈 true
assertGtin(v);
normalizeGtin(v);
detectBarcodeType(v);
```

##### If you relied on the default refusal

With `parseGtin`, `parseGtinOrThrow` and `createGtinParser`, list the accepted categories. The reason is `invalid_category` instead of `restricted`.

```typescript
// before
parseGtin("2123456789010"); // 👈 { success: false, reason: "restricted" }

// after: every category but in_store
const categories = [
  "trade_item",
  "isbn",
  "ismn",
  "issn",
  "coupon",
  "refund_receipt",
] as const;
parseGtin("2123456789010", { categories }); // 👈 { success: false, reason: "invalid_category" }

// or once, with a parser
const gtinParser = createGtinParser({ categories });
gtinParser.parse("2123456789010"); // 👈 { success: false, reason: "invalid_category" }
```

With the other functions, check them with `isInStoreGtin`.

```typescript
import { isGtin, isInStoreGtin, normalizeGtin } from "@httpx/barcode";

// before
if (isGtin(v)) {
  /* a product */
}
const gtin = normalizeGtin(v); // 👈 null for an in-store code

// after
if (isGtin(v) && !isInStoreGtin(v)) {
  /* a product */
}
// trim like normalizeGtin does (isInStoreGtin doesn't by default)
const gtin = isInStoreGtin(v, { trim: true }) ? null : normalizeGtin(v);
```

> `isInStoreGtin` accepts the same values as `normalizeGtin` (string, number or bigint) but doesn't trim by default: pass `{ trim: true }` when the value is trimmed by `normalizeGtin` or `formatGtin`.

##### Guards and assertions signatures

Guards take a single argument, assertions lose their third argument (`options`). Guards are now safe to pass to array methods.

```typescript
// before
codes.filter((c) => isEan13(c));
assertEan13(v, "Invalid ean", { acceptRestricted: true });

// after
codes.filter(isEan13); // 👈 Ean13[]
assertEan13(v, "Invalid ean");
```

`isUpcE`, `assertUpcE`, `expandUpcE` and `compressUpcA` lose the option too. It never had an effect on them: a UPC-E is never an in-store code.

##### createGtinParser types

The `category` of a parser result is narrowed from `categories` only: it includes `in_store` unless `categories` excludes it (up to v0.3, `restricted` was excluded unless `acceptRestricted: true`).

```typescript
const parser = createGtinParser({ types: ["ean13"] });
// v0.3: category is "trade_item" | "isbn" | "ismn" | "issn" | "coupon" | "refund_receipt"
// v0.4: category also includes "in_store"
```

##### minLength under 8

A value with less than 8 significant digits is an EAN-8 starting with 0, an in-store code. Up to v0.3 it was refused whatever `minLength` (unless `acceptRestricted`). From v0.4, lowering `minLength` accepts it. The default (`8`) is unchanged.

```typescript
normalizeGtin(1234565); // 👈 null (7 digits, default minLength)
normalizeGtin(1234565, { minLength: 7 }); // 👈 v0.3: null, v0.4: "00000001234565"
```

> Only lower `minLength` when in-store EAN-8 are stored as numbers: the check digit is the only validation left, 1 in 10 of any small number passes it.

#### isRestrictedCirculation is renamed to isInStoreGtin

Like the `in_store` category of `parseGtin`. Same behaviour and options (the `acceptRestricted` option it ignored is removed). The `IsRestrictedCirculationOptions` type is renamed to `IsInStoreGtinOptions`.

```typescript
// before
import { isRestrictedCirculation } from "@httpx/barcode";
isRestrictedCirculation("2123456789010"); // 👈 true

// after
import { isInStoreGtin } from "@httpx/barcode";
isInStoreGtin("2123456789010"); // 👈 true
```

#### parseGtin: inputType is renamed to format

The `inputType` field of a successful result (the format of the barcode as given: `ean8`, `upca`, `ean13`, `gtin14`, `upce` or `null`) is renamed to `format`. It's matched by the new `formats` option, and no longer confused with the `inputTypes` option (the accepted JavaScript types: `string`, `number`, `bigint`), which is unchanged.

```typescript
const result = parseGtin("0036000291452");
if (result.success) {
  // before
  result.inputType; // 👈 "ean13"
  // after
  result.format; // 👈 "ean13"
}
```

`ParsedGtin` and `ParseGtinResult` get a third type parameter for it (`TFormat`, defaults to `BarcodeFormat | null`).

#### parseGtin: failure reasons

`ParseGtinErrorReason` changes, update the code handling every reason (ie: an exhaustive `switch`, translations).

| Reason | Change |
| --- | --- |
| `restricted` | Removed. In-store codes are accepted, or refused with `categories` (reason `invalid_category`) |
| `format_not_accepted` | Added. Only with the new `formats` option: the format as given isn't listed, or can't be known (number, bigint, string of another length) |

### New in v0.4

Not breaking, see the [README](https://github.com/belgattitude/httpx/blob/main/packages/barcode/README.md) for details.

- UPC-E detection: `upce: "prefer-ean8"` (safest) and `upce: "prefer-upce"` for `parseGtin`, `createGtinParser` and `detectBarcodeType`, which also accepts `upce: true`. `upce: true` is unchanged.
- `formats` option of `parseGtin` and `createGtinParser`: accepted formats as given, ie: to refuse or require UPC-E.
- `isUpcE` is ~6x faster. Guards, assertions, `normalizeGtin` and `formatGtin` are smaller (no restricted circulation check), `normalizeGtin` is also faster.
