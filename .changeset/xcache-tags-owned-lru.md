---
"@httpx/xcache": minor
---

Add tags support (`runAsync({ tags })` and `invalidateTags()`), the lru is now created by XMemCache.

**Breaking:** the `lru` option takes the lru options instead of an instance (same for `createHonoXCache`). The lru can't be shared anymore (use namespaces instead):

```diff
- import { XMemCache, TimeLruCache } from "@httpx/xcache";
+ import { XMemCache } from "@httpx/xcache";

  const xMemCache = new XMemCache({
-   lru: new TimeLruCache({ maxSize: 500, defaultTTL: 60_000 }),
+   lru: { maxSize: 500, defaultTTL: 60_000 },
  });
```

Also removed: the `TimeLruCache` re-export (import it from `@httpx/lru`), and the optional `isCompatible` method of `ICacheCompressor` (no longer used by XMemCache, `CacheCompress.isCompatible` is kept). `timings` and `usage` are now always set in `meta.timings` and in the `getEntryInfo()` / `getStats()` entries.

Tags:

```typescript
await xMemCache.runAsync({
  key: ["/api/user", { id: 1 }],
  fn: () => fetchUser(1),
  tags: ["users", "user:1"], // or (user) => [`org:${user.orgId}`]
});

xMemCache.invalidateTags("user:1"); // returns the number of removed entries
```

- Invalidated entries are removed immediately, and functions executing while one of their tags is invalidated don't store their (possibly stale) result.
- Tags are returned in `meta.tags`, `getEntryInfo()` and `getStats()` entries, `getStats().totals.invalidated` counts the removed entries.
- New `size` getter, and `onEviction` lru option.
