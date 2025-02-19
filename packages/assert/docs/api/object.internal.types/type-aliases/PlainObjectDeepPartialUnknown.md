[**@httpx/assert v0.15.2**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.internal.types](../README.md) / PlainObjectDeepPartialUnknown

# Type Alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>> : unknown }`

Defined in: [object.internal.types.ts:11](https://github.com/belgattitude/httpx/blob/d975bb2c60098569db690fb567053dfa3514ae29/packages/assert/src/object.internal.types.ts#L11)

## Type Parameters

• **T**
