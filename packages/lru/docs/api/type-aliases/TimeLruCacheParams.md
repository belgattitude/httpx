[**@httpx/lru v0.11.0**](../README.md)

***

[@httpx/lru](../README.md) / TimeLruCacheParams

# Type Alias: TimeLruCacheParams\<TValue, TKey\>

> **TimeLruCacheParams**\<`TValue`, `TKey`\> = [`LruCacheParams`](LruCacheParams.md)\<`TValue`, `TKey`\> & `object`

## Type declaration

### defaultTTL

> **defaultTTL**: `Milliseconds`

Default time to live for each entry in milliseconds

## Type Parameters

### TValue

`TValue` = `unknown`

### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](BaseCacheKeyTypes.md) = `string`
