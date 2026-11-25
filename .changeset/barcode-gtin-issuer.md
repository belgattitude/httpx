---
"@httpx/barcode": minor
---

Add an `issuer` field to `parseGtin` / `parseGtinOrThrow` results: the GS1 Member Organisation that issued the GS1 Prefix (ie: `"GS1 France"` for `325...`), from the full GS1 prefix table. `null` when the prefix isn't allocated.
