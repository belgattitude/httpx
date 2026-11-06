---
"@httpx/barcode": minor
---

Add UPC-E support: `isUpcE`, `assertUpcE`, `expandUpcE`, `compressUpcA` and the `upce` option of `parseGtin`.

UPC-E is the zero-suppressed form of a UPC-A (8 digits, number system `0` or `1`, check digit of the UPC-A). Its GTIN is the expanded UPC-A. UPC-A starting with `0000` (the GTIN-8 range, same GTIN as an EAN-8) have no UPC-E. With `parseGtin`, `minLength` counts a UPC-E as its 12 digit UPC-A. As an 8 digit value can be both a valid UPC-E and a valid EAN-8, 8 digits are still read as EAN-8 unless asked otherwise.

```typescript
isUpcE("04252614"); // 👈 true
expandUpcE("04252614"); // 👈 "042100005264" (UpcA)
compressUpcA("00042100005264"); // 👈 "04252614" (UpcE)

parseGtin("04252614", { upce: true });
// 👈 { success: true, value: "042100005264", type: "upca", gtin: "00042100005264", inputType: "upce", indicator: 0, category: "trade_item" }
```
