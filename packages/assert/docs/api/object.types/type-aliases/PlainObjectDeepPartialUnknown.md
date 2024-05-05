[**@httpx/assert v0.10.2**](../../README.md) • **Docs**

***

[@httpx/assert v0.10.2](../../README.md) / [object.types](../README.md) / PlainObjectDeepPartialUnknown

# Type alias: PlainObjectDeepPartialUnknown\<T\>

> **PlainObjectDeepPartialUnknown**\<`T`\>: `{ [P in keyof T]?: NonNullable<T[P]> extends Record<string, unknown> ? PlainObjectDeepPartialUnknown<NonNullable<T[P]>> : unknown }`

## Type parameters

• **T**
