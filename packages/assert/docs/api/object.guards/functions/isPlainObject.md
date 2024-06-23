[**@httpx/assert v0.12.3**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.3](../../README.md) / [object.guards](../README.md) / isPlainObject

# Function: isPlainObject()

> **isPlainObject**\<`TValue`\>(`v`): `v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

Check if a value is a plain object

An object is plain if it's created by either {}, new Object(), or Object.create(null).

## Type Parameters

• **TValue** *extends* `Record`\<`string`, `unknown`\> = [`UnspecifiedPlainObjectType`](../../object.internal.types/type-aliases/UnspecifiedPlainObjectType.md)

## Parameters

• **v**: `unknown`

## Returns

`v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

## Defined in

[object.guards.ts:31](https://github.com/belgattitude/httpx/blob/74dc9cd764aa64a9b1889ffb70a7f65e9435af37/packages/assert/src/object.guards.ts#L31)
