[**@httpx/assert v0.12.3**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.3](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

## Type Parameters

• **T**

## Defined in

[object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/74dc9cd764aa64a9b1889ffb70a7f65e9435af37/packages/assert/src/object.internal.types.ts#L11)
