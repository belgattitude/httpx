[**@httpx/assert v0.10.2**](../../README.md) • **Docs**

***

[@httpx/assert v0.10.2](../../README.md) / [object.types](../README.md) / PlainObjectDeepPartialUnknown

# Type alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends Record<string, unknown> ? PlainObjectDeepPartialUnknown<NonNullable<T[P]>> : unknown }`

## Type parameters

• **T**

## Source

[object.types.ts:1](https://github.com/belgattitude/httpx/blob/c2b4400d3e1e7ce81677911e5629c323b752b635/packages/assert/src/object.types.ts#L1)
