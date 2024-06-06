[**@httpx/assert v0.12.2**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.2](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

## Type parameters

• **T**

## Source

[object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/736f60a5e7cab55c1cdb451c3a30a47ad2eca5ed/packages/assert/src/object.internal.types.ts#L11)
