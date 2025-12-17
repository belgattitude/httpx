[**@httpx/lru v0.13.0**](../README.md)

---

[@httpx/lru](../README.md) / GetOrCreateLruCacheOptions

# Type Alias: GetOrCreateLruCacheOptions

> **GetOrCreateLruCacheOptions** = `object`

## Properties

### onCreate()?

> `optional` **onCreate**: \<`TValue`, `TKey`\>(`name`, `params`) => `void`

#### Type Parameters

##### TValue

`TValue` _extends_ [`SupportedCacheValues`](SupportedCacheValues.md) = [`SupportedCacheValues`](SupportedCacheValues.md)

##### TKey

`TKey` _extends_ [`BaseCacheKeyTypes`](BaseCacheKeyTypes.md) = `string`

#### Parameters

##### name

`LruCacheSingleInstanceName`

##### params

[`LruCacheParams`](LruCacheParams.md)\<`TValue`, `TKey`\>

#### Returns

`void`
