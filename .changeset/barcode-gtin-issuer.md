---
"@httpx/barcode": minor
---

Add an `issuer` field to `parseGtin` / `parseGtinOrThrow` results: the GS1 Member Organisation that issued the GS1 Prefix (ie: `"GS1 France"` for `325...`), from the full GS1 prefix table. `null` when the prefix isn't allocated.

Also export `getGtinIssuer(value, options?)`, and read the GS1 prefix once for both `category` and `issuer` (no `parseGtin` slowdown). `parseGtin`, `parseGtinOrThrow` and `createGtinParser` grow by about 1.35KB (brotli) for the prefix table.
