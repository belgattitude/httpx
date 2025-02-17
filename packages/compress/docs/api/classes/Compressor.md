[**@httpx/compress v0.0.2**](../README.md)

***

[@httpx/compress](../README.md) / Compressor

# Class: Compressor

## Constructors

### new Compressor()

> **new Compressor**(`compressionMethod`): [`Compressor`](Compressor.md)

#### Parameters

##### compressionMethod

`SupportedCompressionAlgorithm`

#### Returns

[`Compressor`](Compressor.md)

## Methods

### toEncodedString()

> **toEncodedString**\<`T`\>(`data`, `options`?): `Promise`\<`string`\>

#### Type Parameters

• **T** *extends* `string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Parameters

##### data

`T`

##### options?

###### encoding?

`"base64"`

#### Returns

`Promise`\<`string`\>

#### Throws

Error

***

### toUint8Array()

> **toUint8Array**\<`T`\>(`data`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Type Parameters

• **T** *extends* `string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Parameters

##### data

`T`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Throws

Error
