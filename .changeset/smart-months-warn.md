---
"@httpx/memo-intl": minor
---

Now 30x faster than non memoized constructors (was 20x before)

Now using [@httpx/lru](https://github.com/belgattitude/httpx/tree/main/packages/lru#readme) instead of [quick-lru](https://github.com/sindresorhus/quick-lru)

Previously

```
  With memoization `MIntl.NumberFormatter()` - bench/m-intl.bench.ts > MIntl benchmarks
    21.64x faster than Without memoization `new Intl.NumberFormatter()`
```

Now

```
  With memoization `MIntl.NumberFormatter()` - bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks
    32.18x faster than Without memoization `new Intl.NumberFormatter()`
```