[**@httpx/hash v0.0.1**](../../README.md)

***

[@httpx/hash](../../README.md) / [xxhash-wasm](../README.md) / XXHash64

# Class: XXHash64

## Constructors

### Constructor

> **new XXHash64**(`xxHash`, `options?`): `XXHash64`

#### Parameters

##### xxHash

`XXHashAPI`

##### options?

`XXHashDefaultOptions`

#### Returns

`XXHash64`

## Properties

### options

> `readonly` **options**: `XXHashDefaultOptions` = `{}`

## Methods

### toBigint()

> **toBigint**(`input`, `seed?`): `bigint`

#### Parameters

##### input

`string`

##### seed?

`bigint`

#### Returns

`bigint`

***

### toSigned64()

> **toSigned64**(`input`, `seed?`): [`SignedInt64`](../../index/type-aliases/SignedInt64.md)

Convert input string to signed 64-bit integer using XXHash64 algorithm.

This accommodates some databases like mssql that do not support unsigned 64-bit integers.

#### Parameters

##### input

`string`

##### seed?

`bigint`

#### Returns

[`SignedInt64`](../../index/type-aliases/SignedInt64.md)
