[**@httpx/lru v0.12.5**](../README.md)

---

[@httpx/lru](../README.md) / getOrCreateTimeLruCache

# Function: getOrCreateTimeLruCache()

> **getOrCreateTimeLruCache**\<`TValue`, `TKey`\>(`name`, `lruCacheParams`, `options?`): [`TimeLruCache`](../classes/TimeLruCache.md)\<`TValue`, `TKey`\>

Creates or retrieves a singleton TimeLruCache instance by name
ensuring that only one instance exists for each unique name.

This helper function relies on globalThis to store and retrieve
the instance.

## Type Parameters

### TValue

`TValue` _extends_ [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

### TKey

`TKey` _extends_ [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Parameters

### name

`string`

### lruCacheParams

[`TimeLruCacheParams`](../type-aliases/TimeLruCacheParams.md)\<`TValue`, `TKey`\>

### options?

[`GetOrCreateTimeLruCacheOptions`](../type-aliases/GetOrCreateTimeLruCacheOptions.md)

## Returns

[`TimeLruCache`](../classes/TimeLruCache.md)\<`TValue`, `TKey`\>

## Example

```typescript
import { getOrCreateTimeLruCache } from "@httpx/lru";

const ttlLru = getOrCreateTimeLruCache("main-cache", {
  maxSize: 500,
  defaultTTL: 60000,
});
```

## Warning

The same name must always be used with consistent TValue and TKey types.
Calling this function with different type parameters for the same name will cause
type safety violations and unexpected behavior.
