[**@httpx/assert v0.12.2**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.2](../../README.md) / [object.asserts](../README.md) / assertPlainObject

# Function: assertPlainObject()

> **assertPlainObject**\<`TValue`\>(`v`, `msgOrErrorFactory`?): `asserts v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

Assert a value is a plain object

## Type parameters

• **TValue** *extends* `Record`\<`string`, `unknown`\> = [`UnspecifiedPlainObjectType`](../../object.internal.types/type-aliases/UnspecifiedPlainObjectType.md)

## Parameters

• **v**: `unknown`

• **msgOrErrorFactory?**: `MsgOrErrorFactory`

## Returns

`asserts v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

## Throws

TypeError

## Source

[object.asserts.ts:15](https://github.com/belgattitude/httpx/blob/736f60a5e7cab55c1cdb451c3a30a47ad2eca5ed/packages/assert/src/object.asserts.ts#L15)
