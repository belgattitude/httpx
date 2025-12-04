[**@httpx/lru v0.12.1**](../README.md)

***

[@httpx/lru](../README.md) / LruCacheParams

# Type Alias: LruCacheParams\<TValue, TKey\>

> **LruCacheParams**\<`TValue`, `TKey`\> = `object`

## Type Parameters

### TValue

`TValue` *extends* [`SupportedCacheValues`](SupportedCacheValues.md) = [`SupportedCacheValues`](SupportedCacheValues.md)

### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](BaseCacheKeyTypes.md) = `string`

## Properties

### maxSize

> **maxSize**: `number`

The maximum number of items that the cache can hold.

***

### onEviction()?

> `optional` **onEviction**: (`key`, `value`) => `void`

Callback that will be called before an item is evicted from the cache.
Useful for side effects or for items like object URLs that need explicit cleanup (revokeObjectURL).

#### Parameters

##### key

`TKey`

##### value

`TValue`

#### Returns

`void`

***

### touchOnHas?

> `optional` **touchOnHas**: `boolean`

If true, the item will be marked as recently used when calling has.

#### Default

```ts
false
```
