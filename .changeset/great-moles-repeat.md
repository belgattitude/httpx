---
"@httpx/lru": minor
---

All TimeLruCache with support for ttl expiry

```typescript
import { TimeLruCache } from '@httpx/lru';

const oneSecondInMillis = 1000;

const lru = new TimeLruCache({
  maxSize: 10,
  defaultTTL: oneSecondInMillis,
  onEviction: () => { console.log('evicted') }
});
```