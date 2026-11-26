---
"@httpx/barcode": minor
---

Add the GS1 issuer of a GTIN.

- `parseGtin`, `parseGtinOrThrow` and `createGtinParser` results have a new `issuer` field: the GS1 Member Organisation that issued the GS1 Prefix (ie: `"GS1 France"` for `325...`), or the special allocation (restricted circulation numbers, coupons, ISBN...). `null` when the prefix isn't allocated. EAN-8 codes follow the GS1-8 rules (`000`-`099` and `200`-`299` are restricted circulation numbers within a company).
- New `getGtinIssuer(value, options?)` returns it for any value `parseGtin` accepts (`null` when invalid or unallocated).
- The prefix table is bundled: `parseGtin`, `parseGtinOrThrow` and `createGtinParser` grow by about 1.35KB (brotli) and `parseGtin` is slightly slower on valid codes (the `category` and `issuer` share one prefix read).
