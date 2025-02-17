[**@httpx/compress v0.0.2**](../README.md)

***

[@httpx/compress](../README.md) / Decompressor

# Class: Decompressor

## Constructors

### new Decompressor()

> **new Decompressor**(`algorithm`): [`Decompressor`](Decompressor.md)

#### Parameters

##### algorithm

`SupportedCompressionAlgorithm`

#### Returns

[`Decompressor`](Decompressor.md)

## Methods

### fromEncodedString()

> **fromEncodedString**(`data`): `Promise`\<`string`\>

#### Parameters

##### data

`string`

#### Returns

`Promise`\<`string`\>

#### Throws

Error

***

### fromUint8Array()

> **fromUint8Array**(`data`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Parameters

##### data

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Throws

Error
