[**@httpx/hash v0.1.0**](../../README.md)

***

[@httpx/hash](../../README.md) / [xxhash-wasm](../README.md) / XXHash64

# Class: XXHash64

XXHash64 hasher using WebAssembly implementation from `xxhash-wasm`.

```typescript
import { createXXWasmHasher } from '@httpx/hash/xxhash-wasm';
export const xxWasm = await createXXWasmHasher({
  defaultSeed: 0n, // optional
});

const hash = xxWasm.toBigint('some input string');
```

## See

createXXHash64

## Constructors

### Constructor

> **new XXHash64**(`xxHash`, `options?`): `XXHash64`

#### Parameters

##### xxHash

`XXHashAPI`

##### options?

[`XXHash64DefaultOptions`](../type-aliases/XXHash64DefaultOptions.md)

#### Returns

`XXHash64`

## Properties

### options

> `readonly` **options**: [`XXHash64DefaultOptions`](../type-aliases/XXHash64DefaultOptions.md) = `{}`

## Methods

### toBigint()

> **toBigint**(`input`, `options?`): `bigint`

Return a 64-bit unsigned integer hash as a bigint using XXHash64 algorithm.

#### Parameters

##### input

`string`

##### options?

[`XXHash64Options`](../type-aliases/XXHash64Options.md)

#### Returns

`bigint`

***

### toSigned64()

> **toSigned64**(`input`, `options?`): [`SignedInt64`](../../index/type-aliases/SignedInt64.md)

Convert input string to signed 64-bit integer using XXHash64 algorithm.

This accommodates some databases like mssql that do not support unsigned 64-bit integers.

#### Parameters

##### input

`string`

##### options?

[`XXHash64Options`](../type-aliases/XXHash64Options.md)

#### Returns

[`SignedInt64`](../../index/type-aliases/SignedInt64.md)
