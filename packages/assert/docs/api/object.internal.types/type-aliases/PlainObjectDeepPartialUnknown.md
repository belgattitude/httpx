[**@httpx/assert v0.16.2**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\> = `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

Defined in: [object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/7682ae8e8bf25ac4dbe7ea6b3b3dbe40b897e70c/packages/assert/src/object.internal.types.ts#L11)

## Type Parameters

### T

`T`
