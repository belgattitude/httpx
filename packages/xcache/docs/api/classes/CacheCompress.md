[**@httpx/xcache v0.4.2**](../README.md)

***

[@httpx/xcache](../README.md) / CacheCompress

# Class: CacheCompress

## Implements

- [`ICacheCompressor`](../interfaces/ICacheCompressor.md)

## Constructors

### Constructor

> **new CacheCompress**(`options`): `CacheCompress`

#### Parameters

##### options

`CacheCompressOptions`

#### Returns

`CacheCompress`

#### Example

```typescript
const cacheGzip = new CacheGzip({
  serializer: new DevalueSerializer(),
  algorithm: 'deflate', // or 'gzip'
  // Skip compression if the achieved compression ratio is less than
  // the provided ratio. 1.3 means that the compression will be skipped
  // if the ratio does not give at least 30 memory reduction
  // @ default 1.3
  minimumRatio: 1.3,
  // Skip compression if the result is a string shorter than 1000 characters
  minimumStringLength: 1000,
  // Skip compression if the achieved byte saving is less than 16 KB
  minimumByteSaving: 16_384,
});
```

## Methods

### compress()

> **compress**\<`T`\>(`data`): `Promise`\<`CacheCompressResult`\>

#### Type Parameters

##### T

`T`

#### Parameters

##### data

`T`

#### Returns

`Promise`\<`CacheCompressResult`\>

#### Implementation of

[`ICacheCompressor`](../interfaces/ICacheCompressor.md).[`compress`](../interfaces/ICacheCompressor.md#compress)

***

### decompress()

> **decompress**\<`T`\>(`data`): `Promise`\<`T`\>

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### data

`CacheCompressResult`

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`ICacheCompressor`](../interfaces/ICacheCompressor.md).[`decompress`](../interfaces/ICacheCompressor.md#decompress)

***

### getIdentifier()

> **getIdentifier**(): `string`

#### Returns

`string`

#### Implementation of

[`ICacheCompressor`](../interfaces/ICacheCompressor.md).[`getIdentifier`](../interfaces/ICacheCompressor.md#getidentifier)
