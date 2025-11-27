[**@httpx/hash v0.2.0**](../../README.md)

***

[@httpx/hash](../../README.md) / [xxhash-wasm](../README.md) / createXXHash64

# Function: createXXHash64()

> **createXXHash64**(`options?`): `Promise`\<[`XXHash64`](../classes/XXHash64.md)\>

Helper function to initialize an instance of the `XXHash64` wasm hasher.

Under the hood, it uses a singleton pattern to ensure that the `xxhash-wasm`
module is only initialized once.

Note that this function is async as the wasm module loading is asynchronous.

```typescript
import { createXXHash64 } from '@httpx/hash/xxhash-wasm';

// Notice the await as wasm loading is async.
const xxHash64 = await createXXHash64({
  // Optionally provide a seed (default is 0n)
  // For example, Spark uses 42 as a default seed
  defaultSeed: 0n,
});

// Javascript Bigint output as 64-bit unsigned integer
const hashedBigint = xxHash64.toBigint('some input string');

// Javascript Bigint output as 64-bit signed integer
const hashedSigned64 = xxHash64.toSigned64('some input string');
```

## Parameters

### options?

[`XXHash64DefaultOptions`](../type-aliases/XXHash64DefaultOptions.md)

## Returns

`Promise`\<[`XXHash64`](../classes/XXHash64.md)\>
