[**@httpx/lru v0.12.1**](../README.md)

***

[@httpx/lru](../README.md) / getOrCreateLruCache

# Function: getOrCreateLruCache()

> **getOrCreateLruCache**\<`TValue`, `TKey`\>(`name`, `lruCacheParams`, `options?`): [`LruCache`](../classes/LruCache.md)\<`TValue`, `TKey`\>

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

[`LruCacheParams`](../type-aliases/LruCacheParams.md)\<`TValue`, `TKey`\>

### options?

`Options`

## Returns

[`LruCache`](../classes/LruCache.md)\<`TValue`, `TKey`\>

## Example

```typescript
import { getOrCreateLruCache } from '@httpx/lru';

const lru = getOrCreateLruCache('main-cache', { maxSize: 500 });
```

## Warning

The same name must always be used with consistent TValue and TKey types.
         Calling this function with different type parameters for the same name will cause
         type safety violations and unexpected behavior.
