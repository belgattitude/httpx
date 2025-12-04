[**@httpx/lru v0.12.1**](../README.md)

***

[@httpx/lru](../README.md) / TimeLruCacheParams

# Type Alias: TimeLruCacheParams\<TValue, TKey\>

> **TimeLruCacheParams**\<`TValue`, `TKey`\> = [`LruCacheParams`](LruCacheParams.md)\<`TValue`, `TKey`\> & `object`

## Type Declaration

### defaultTTL

> **defaultTTL**: `Milliseconds`

Default time to live for each entry in milliseconds

## Type Parameters

### TValue

`TValue` *extends* [`SupportedCacheValues`](SupportedCacheValues.md) = [`SupportedCacheValues`](SupportedCacheValues.md)

### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](BaseCacheKeyTypes.md) = `string`
