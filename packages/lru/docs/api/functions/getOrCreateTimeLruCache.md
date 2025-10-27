[**@httpx/lru v0.11.5**](../README.md)

***

[@httpx/lru](../README.md) / getOrCreateTimeLruCache

# Function: getOrCreateTimeLruCache()

> **getOrCreateTimeLruCache**\<`TValue`, `TKey`\>(`name`, `lruCacheParams`, `options?`): [`TimeLruCache`](../classes/TimeLruCache.md)\<`TValue`, `TKey`\>

Creates or retrieves a singleton LruCache instance by name
ensuring that only one instance exists for each unique name.

This helper function relies on globalThis to store and retrieve
the instance.

## Type Parameters

### TValue

`TValue` *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Parameters

### name

`string`

### lruCacheParams

[`TimeLruCacheParams`](../type-aliases/TimeLruCacheParams.md)\<`TValue`, `TKey`\>

### options?

`Options`

## Returns

[`TimeLruCache`](../classes/TimeLruCache.md)\<`TValue`, `TKey`\>

## Example

```typescript
import { getOrCreateTimeLruCache } from '@httpx/lru';

const ttlLru = getOrCreateTimeLruCache('main-cache', { maxSize: 500 });
```
