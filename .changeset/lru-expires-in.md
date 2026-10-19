---
"@httpx/lru": minor
---

Add `TimeLruCache.expiresIn(key)` returning the remaining time to live of an entry in milliseconds, or `undefined` if the entry doesn't exist or has expired.

```typescript
import { TimeLruCache } from "@httpx/lru";

const lru = new TimeLruCache({ maxSize: 10, defaultTTL: 1000 });
lru.set("key1", "value1", 500);
lru.expiresIn("key1"); // 👈 500 (or slightly less as time passes)
lru.expiresIn("unknown"); // 👈 undefined
```

Like `peek()`, it doesn't mark the entry as recently used and doesn't evict expired entries. Also available on `NullTimeLruCache` (always `undefined`).

**Breaking (types)**: `expiresIn` is a new required member of the `ITimeLruCache` interface (only relevant for custom implementations).
