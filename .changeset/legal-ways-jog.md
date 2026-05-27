---
"@httpx/lru": minor
---

[BC] getOrSet() method signature change

The third parameter of `getOrSet()` method is now an object with the following properties:

- `forceRevalidate`: boolean // default false, force revalidation even if the value is already in the cache
- `ttl`: number // only for TimeLruCache 

Usage:

```typescript
import { TimeLruCache } from '@httpx/lru';

const lru = new TimeLruCache({
    maxSize: 1,
    defaultTTL: 1000
});

// old usage
const value = lru.getOrSet('key', () => Promise.resolve('value'), ttl);
// new usage
const value = lru.getOrSet('key', () => Promise.resolve('value'), { 
    ttl: 2000,
    // Will force revalidation even if the value is already in the cache. 
    // This is useful if you want to refresh the value in the cache without waiting for it to expire.
    // Optional (default to false)
    forceRevalidate: false 
}); 
```