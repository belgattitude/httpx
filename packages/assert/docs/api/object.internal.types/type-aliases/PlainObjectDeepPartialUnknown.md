[**@httpx/assert v0.15.5**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\> = `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

Defined in: [object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/7903e9ebf18607df55b9a2972c85cfc54f82587a/packages/assert/src/object.internal.types.ts#L11)

## Type Parameters

### T

`T`
