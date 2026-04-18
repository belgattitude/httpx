[**@httpx/lru v0.13.2**](../README.md)

***

[@httpx/lru](../README.md) / GetOrCreateLruCacheOptions

# Type Alias: GetOrCreateLruCacheOptions

> **GetOrCreateLruCacheOptions** = `object`

## Properties

### onCreate?

> `optional` **onCreate?**: \<`TValue`, `TKey`\>(`name`, `params`) => `void`

#### Type Parameters

##### TValue

`TValue` *extends* [`SupportedCacheValues`](SupportedCacheValues.md) = [`SupportedCacheValues`](SupportedCacheValues.md)

##### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](BaseCacheKeyTypes.md) = `string`

#### Parameters

##### name

`LruCacheSingleInstanceName`

##### params

[`LruCacheParams`](LruCacheParams.md)\<`TValue`, `TKey`\>

#### Returns

`void`
