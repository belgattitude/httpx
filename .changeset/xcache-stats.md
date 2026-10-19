---
"@httpx/xcache": minor
---

Add `XMemCache.getStats()` and `XMemCache.getEntryInfo()`.

```typescript
const {
  items,
  nativeItems,
  compressedItems,
  compressedSize,
  originalSize,
  entries,
} = xMemCache.getStats();

const info = xMemCache.getEntryInfo({ key: ["/api/data", params] });
// { key, format: "compressed", size, compression: { algorithm, encoding, serializer, originalSize, compressedSize, ratio } }
```

- Each entry exposes its generated key, its format (`native` or `compressed`), its size and compression meta when compressed, or the reason compression was skipped, and its remaining time to live (`expiresIn`, from the new `TimeLruCache.expiresIn()`).
- Expired entries are ignored, the lru order is not affected.
- Values stored by `XMemCache` are now branded: when the lru is shared with other code, values not created by `XMemCache` (even if they look alike) are ignored by the stats and treated as a cache miss by `runAsync()`. The `isXMemCacheEntry()` typeguard is exported.
- New exported types: `XMemCacheStats`, `XMemCacheEntryInfo`, `XMemCacheEntry`.
