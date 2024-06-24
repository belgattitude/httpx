[**@httpx/plain-object v0.0.1**](../README.md) • **Docs**

***

[@httpx/plain-object v0.0.1](../README.md) / isPlainObject

# Function: isPlainObject()

> **isPlainObject**\<`TValue`\>(`v`): `v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`

Check if a value is a plain object

An object is plain if it's created by either {}, new Object(), or Object.create(null).

## Type Parameters

• **TValue** *extends* `BasePlainObject` = `DefaultBasePlainObject`

## Parameters

• **v**: `unknown`

## Returns

`v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`
