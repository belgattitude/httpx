[**@httpx/xcache v0.4.5**](../README.md)

***

[@httpx/xcache](../README.md) / ICacheSerializer

# Interface: ICacheSerializer

## Properties

### deserialize()

> **deserialize**: \<`T`\>(`serializedData`) => `T`

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### serializedData

`string`

#### Returns

`T`

***

### getIdentifier()

> **getIdentifier**: () => `string`

#### Returns

`string`

***

### serialize()

> **serialize**: \<`T`\>(`data`) => `string`

#### Type Parameters

##### T

`T`

#### Parameters

##### data

`T`

#### Returns

`string`

***

### toString()

> **toString**: () => `string`

#### Returns

`string`
