[**@httpx/assert v0.10.2**](../../README.md) • **Docs**

***

[@httpx/assert v0.10.2](../../README.md) / [object.types](../README.md) / PlainObjectDeepPartialUnknown

# Type alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends Record<string, unknown> ? PlainObjectDeepPartialUnknown<NonNullable<T[P]>> : unknown }`

## Type parameters

• **T**

## Source

[object.types.ts:1](https://github.com/belgattitude/httpx/blob/9872a04f73c192beff5f4b4d63a156ff5269c00c/packages/assert/src/object.types.ts#L1)
