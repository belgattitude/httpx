[**@httpx/assert v0.15.1**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

## Type Parameters

• **T**

## Defined in

[object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/d121a71b95064daafd75a20aabf0a30f5fcdfbfa/packages/assert/src/object.internal.types.ts#L11)
