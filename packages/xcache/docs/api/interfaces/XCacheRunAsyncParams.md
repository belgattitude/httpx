[**@httpx/xcache v0.5.0**](../README.md)

***

[@httpx/xcache](../README.md) / XCacheRunAsyncParams

# Interface: XCacheRunAsyncParams\<TFunction\>

## Type Parameters

### TFunction

`TFunction` *extends* [`CacheableAsyncFunction`](../type-aliases/CacheableAsyncFunction.md)

## Properties

### fn

> **fn**: (`key`) => `Awaited`\<`ReturnType`\<`TFunction`\>\>

#### Parameters

##### key

`CacheKeyTuple`

#### Returns

`Awaited`\<`ReturnType`\<`TFunction`\>\>

***

### key

> **key**: `CacheKeyTuple`

***

### namespace?

> `optional` **namespace?**: `string`

***

### ttl?

> `optional` **ttl?**: `number`
