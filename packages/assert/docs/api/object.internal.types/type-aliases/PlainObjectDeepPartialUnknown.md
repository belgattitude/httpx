[**@httpx/assert v0.16.3**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\> = `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

Defined in: [object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/9b2cbd569895f8040210d7274ce6ead66a415c7d/packages/assert/src/object.internal.types.ts#L11)

## Type Parameters

### T

`T`
