[**@httpx/assert v0.12.3**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.3](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

## Type Parameters

• **T**

## Defined in

[object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/efdc4c7f5d90eb963a8ba204526e9494bbd080b8/packages/assert/src/object.internal.types.ts#L11)
