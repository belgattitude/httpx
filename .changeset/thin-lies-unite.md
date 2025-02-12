---
"@httpx/lru": minor
---

TValue now extends SupportedValues (instead of unknown)

```typescript
type BaseCacheValueTypes =
  | string
  | number
  | bigint
  | boolean
  | null
  | unknown[]
  // objects or functions, but not promises
  | (object & { then?: void })
  | Record<string | number | symbol, unknown>;

export type SupportedCacheValues =
  | Readonly<BaseCacheValueTypes>
  | BaseCacheValueTypes;

```