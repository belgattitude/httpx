[**@httpx/lru v0.12.5**](../README.md)

---

[@httpx/lru](../README.md) / TimeLruCacheParams

# Type Alias: TimeLruCacheParams\<TValue, TKey\>

> **TimeLruCacheParams**\<`TValue`, `TKey`\> = [`LruCacheParams`](LruCacheParams.md)\<`TValue`, `TKey`\> & `object`

## Type Declaration

### defaultTTL

> **defaultTTL**: `Milliseconds`

Default time to live for each entry in milliseconds

## Type Parameters

### TValue

`TValue` _extends_ [`SupportedCacheValues`](SupportedCacheValues.md) = [`SupportedCacheValues`](SupportedCacheValues.md)

### TKey

`TKey` _extends_ [`BaseCacheKeyTypes`](BaseCacheKeyTypes.md) = `string`
