[**@httpx/compress v0.3.6**](../README.md)

***

[@httpx/compress](../README.md) / Decompressor

# Class: Decompressor

## Constructors

### Constructor

> **new Decompressor**(`algorithm`): `Decompressor`

#### Parameters

##### algorithm

`SupportedCompressionAlgorithm`

#### Returns

`Decompressor`

## Methods

### fromEncodedString()

> **fromEncodedString**(`compressedString`, `options?`): `Promise`\<`string`\>

Decompress a compressed string and return it as a string

```typescript
import { Decompressor } from '@httpx/compress';

const decompressor = new Decompressor('gzip');

// Previously compressed with Compressor.toEncodedString()
const compressedString = 'H4sIAAAAAAAAAwvJLS5R4gUAFvQ7FwAAAA==';

const decompressedString = await decompressor.fromEncodedString(compressedString);
```

#### Parameters

##### compressedString

`string`

##### options?

`EncodeStringOptions`

#### Returns

`Promise`\<`string`\>

#### Throws

Error

***

### fromUint8Array()

> **fromUint8Array**(`data`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Decompress a compressed Uint8Array and return it as a Uint8Array

```typescript
import { Decompressor } from '@httpx/compress';
const decompressor = new Decompressor('gzip');
const decompressed = await decompressor.fromUint8Array(compressedData);
```

#### Parameters

##### data

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Throws

Error
