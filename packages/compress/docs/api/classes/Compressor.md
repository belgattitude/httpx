[**@httpx/compress v0.3.6**](../README.md)

***

[@httpx/compress](../README.md) / Compressor

# Class: Compressor

## Constructors

### Constructor

> **new Compressor**(`compressionMethod`): `Compressor`

Create a new Compressor instance.

```typescript
import { Compressor } from '@httpx/compress';

const compressor = new Compressor('gzip'); // or 'deflate'

const binary = await compressor.toUint8Array('Hello, World! 🦆');
const textEncoded = await compressor.toEncodedString('Hello, World! 🦆');
```

#### Parameters

##### compressionMethod

`SupportedCompressionAlgorithm`

#### Returns

`Compressor`

## Methods

### toEncodedString()

> **toEncodedString**\<`T`\>(`data`, `options?`): `Promise`\<`string`\>

Compress the given data and return it as a base64 encoded string.

```typescript
import { Compressor } from '@httpx/compress';

const compressor = new Compressor('gzip');
const longString = 'Hello, World! 🦆'.repeat(500_000);

const compressedString = await compressor.toEncodedString(longString, {
  // Default is 'base64'
  encoding: 'base64',
});
```

#### Type Parameters

##### T

`T` *extends* `string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Parameters

##### data

`T`

##### options?

`EncodeStringOptions`

#### Returns

`Promise`\<`string`\>

#### Throws

TypeError if the encoding is not supported

***

### toUint8Array()

> **toUint8Array**\<`T`\>(`data`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Compress the given data and return it as a Uint8Array binary format

```typescript
import { Compressor } from '@httpx/compress';

const compressor = new Compressor('gzip');
const longString = 'Hello, World! 🦆'.repeat(500_000);
const compressedBinary = await compressor.Uint8Array(longString);
```

#### Type Parameters

##### T

`T` *extends* `string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Parameters

##### data

`T`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Throws

Error
