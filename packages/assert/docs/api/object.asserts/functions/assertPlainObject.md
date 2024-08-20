[**@httpx/assert v0.12.4**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.4](../../README.md) / [object.asserts](../README.md) / assertPlainObject

# Function: assertPlainObject()

> **assertPlainObject**\<`TValue`\>(`v`, `msgOrErrorFactory`?): `asserts v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

Assert a value is a plain object

## Type Parameters

• **TValue** *extends* `Record`\<`string`, `unknown`\> = [`UnspecifiedPlainObjectType`](../../object.internal.types/type-aliases/UnspecifiedPlainObjectType.md)

## Parameters

• **v**: `unknown`

• **msgOrErrorFactory?**: `MsgOrErrorFactory`

## Returns

`asserts v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

## Throws

TypeError

## Defined in

[object.asserts.ts:15](https://github.com/belgattitude/httpx/blob/9d56eb57739de47a2eced4122ffa042138007013/packages/assert/src/object.asserts.ts#L15)
