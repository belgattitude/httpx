[**@httpx/xcache v0.4.5**](../README.md)

***

[@httpx/xcache](../README.md) / ICacheCompressor

# Interface: ICacheCompressor

## Properties

### compress()

> **compress**: \<`T`\>(`data`) => `Promise`\<`CacheCompressResult`\<`unknown`\>\>

#### Type Parameters

##### T

`T`

#### Parameters

##### data

`T`

#### Returns

`Promise`\<`CacheCompressResult`\<`unknown`\>\>

***

### decompress()

> **decompress**: \<`T`\>(`data`) => `Promise`\<`T`\>

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### data

`CacheCompressResult`

#### Returns

`Promise`\<`T`\>

***

### getIdentifier()

> **getIdentifier**: () => `string`

#### Returns

`string`
