---
"@httpx/barcode": minor
---

Detect UPC-E: `upce: "prefer-ean8"` and `upce: "prefer-upce"` options for `parseGtin` and `createGtinParser`, and `upce` option (`true`, `"prefer-ean8"` or `"prefer-upce"`) for `detectBarcodeType`.

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
