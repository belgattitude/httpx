[**@httpx/xcache v0.4.2**](../README.md)

***

[@httpx/xcache](../README.md) / JsonSerializer

# Class: JsonSerializer

Native JSON serializer. Does not support BigInt, ... serialization.

## Implements

- [`ICacheSerializer`](../interfaces/ICacheSerializer.md)

## Constructors

### Constructor

> **new JsonSerializer**(): `JsonSerializer`

#### Returns

`JsonSerializer`

## Methods

### deserialize()

> **deserialize**\<`T`\>(`serializedData`): `T`

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### serializedData

`string`

#### Returns

`T`

#### Implementation of

[`ICacheSerializer`](../interfaces/ICacheSerializer.md).[`deserialize`](../interfaces/ICacheSerializer.md#deserialize)

***

### getIdentifier()

> **getIdentifier**(): `string`

#### Returns

`string`

#### Implementation of

[`ICacheSerializer`](../interfaces/ICacheSerializer.md).[`getIdentifier`](../interfaces/ICacheSerializer.md#getidentifier)

***

### serialize()

> **serialize**\<`T`\>(`data`): `string`

#### Type Parameters

##### T

`T`

#### Parameters

##### data

`T`

#### Returns

`string`

#### Implementation of

[`ICacheSerializer`](../interfaces/ICacheSerializer.md).[`serialize`](../interfaces/ICacheSerializer.md#serialize)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Implementation of

[`ICacheSerializer`](../interfaces/ICacheSerializer.md).[`toString`](../interfaces/ICacheSerializer.md#tostring)
