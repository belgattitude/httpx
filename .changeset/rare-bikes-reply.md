---
"@httpx/lru": minor
---

Add helpers to preserve single instances based on globalThis. Particularly useful
for frameworks like nextjs or vite that might recreate instances when reloading a
module. This replace the need to manually preserve instances on globalThis when using
regular constructors.

## getOrCreateLruCache

```typescript
import { getOrCreateLruCache } from '@httpx/lru';

// Replaces `new LruCache(...)` with a singleton instance preserved on globalThis
const lru = getOrCreateLruCache('main-cache', { maxSize: 500 });
```

## getOrCreateTimeLruCache

```typescript
import { getOrCreateTimeLruCache } from '@httpx/lru';

// Replaces `new TimeLruCache(...)` with a singleton instance preserved on globalThis
const lru = getOrCreateTimeLruCache('main-ttl-cache', { 
    maxSize: 500,
    defaultTTL: 60000
});
```