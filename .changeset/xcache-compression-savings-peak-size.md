---
"@httpx/xcache": minor
---

Add `compressionSavings` and `totals.peakSize` to `XMemCache.getStats()`.

- `compressionSavings`: size saved by compression for the current entries (`originalSize - compressedSize`).
- `totals.peakSize`: highest measured size of the entries (`compressedSize + nativeOriginalSize`) encountered since the instance creation (or `resetStats()`). It's sampled when calling `getStats()`, `clear()` and `clearExpired()`.

```typescript
const { compressionSavings, totals } = xMemCache.getStats();
console.log(compressionSavings, totals.peakSize);
```
