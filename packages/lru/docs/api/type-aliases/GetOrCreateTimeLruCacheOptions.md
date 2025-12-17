[**@httpx/lru v0.13.0**](../README.md)

---

[@httpx/lru](../README.md) / GetOrCreateTimeLruCacheOptions

# Type Alias: GetOrCreateTimeLruCacheOptions

> **GetOrCreateTimeLruCacheOptions** = `object`

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

`TimeLruCacheSingleInstanceName`

##### params

[`TimeLruCacheParams`](TimeLruCacheParams.md)\<`TValue`, `TKey`\>

#### Returns

`void`
