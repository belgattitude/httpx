[**@httpx/assert v0.16.7**](../../README.md)

---

[@httpx/assert](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\> = `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

Defined in: [object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/38d880ecf05f1934d921b8525130cab1b4a6f511/packages/assert/src/object.internal.types.ts#L11)

## Type Parameters

### T

`T`
