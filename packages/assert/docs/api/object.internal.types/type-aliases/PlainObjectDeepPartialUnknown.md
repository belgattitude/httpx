[**@httpx/assert v0.12.4**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.4](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

## Type Parameters

• **T**

## Defined in

[object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/acde85be3548fccd6cc1a311d7f8d4419e2b6ce0/packages/assert/src/object.internal.types.ts#L11)
