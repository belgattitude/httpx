[**@httpx/lru v0.13.4**](../README.md)

***

[@httpx/lru](../README.md) / getOrCreateTimeLruCache

# Function: getOrCreateTimeLruCache()

> **getOrCreateTimeLruCache**\<`TValue`, `TKey`\>(`name`, `lruCacheParams`, `options?`): [`TimeLruCache`](../classes/TimeLruCache.md)\<`TValue`, `TKey`\>

Creates or retrieves a singleton TimeLruCache instance by name
ensuring that only one instance exists for each unique name.

This helper function relies on globalThis to store and retrieve
the instance.

## Type Parameters

### TValue

`TValue` *extends* `SupportedCacheValues` = `SupportedCacheValues`

### TKey

`TKey` *extends* `BaseCacheKeyTypes` = `string`

## Parameters

### name

`string`

### lruCacheParams

`TimeLruCacheParams`\<`TValue`, `TKey`\>

### options?

`GetOrCreateTimeLruCacheOptions`

## Returns

[`TimeLruCache`](../classes/TimeLruCache.md)\<`TValue`, `TKey`\>

## Example

```typescript
import { getOrCreateTimeLruCache } from '@httpx/lru';

const ttlLru = getOrCreateTimeLruCache('main-cache', { maxSize: 500, defaultTTL: 60000 });
```

## Warning

The same name must always be used with consistent TValue and TKey types.
         Calling this function with different type parameters for the same name will cause
         type safety violations and unexpected behavior.
