[**@httpx/assert v0.12.3**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.3](../../README.md) / [object.asserts](../README.md) / assertPlainObject

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

[object.asserts.ts:15](https://github.com/belgattitude/httpx/blob/efdc4c7f5d90eb963a8ba204526e9494bbd080b8/packages/assert/src/object.asserts.ts#L15)
