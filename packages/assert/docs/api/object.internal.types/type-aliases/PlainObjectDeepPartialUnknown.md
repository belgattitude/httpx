[**@httpx/assert v0.11.0**](../../README.md) • **Docs**

***

[@httpx/assert v0.11.0](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

## Type parameters

• **T**

## Source

[object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/87fb49862cf7e06acc8e0c35f7b115413ff3c6fe/packages/assert/src/object.internal.types.ts#L11)
