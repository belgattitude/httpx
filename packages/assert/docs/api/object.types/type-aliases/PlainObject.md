[**@httpx/assert v0.16.2**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.types](../README.md) / PlainObject

# Type Alias: PlainObject\<TValue\>

> **PlainObject**\<`TValue`\> = `TValue` *extends* [`DefaultBasePlainObject`](../../object.internal.types/interfaces/DefaultBasePlainObject.md) ? `Record`\<[`PlainObjectKey`](../../object.internal.types/type-aliases/PlainObjectKey.md), `unknown`\> : `Simplify`\<[`PlainObjectDeepPartialUnknown`](../../object.internal.types/type-aliases/PlainObjectDeepPartialUnknown.md)\<`TValue`\>\>

Defined in: [object.types.ts:9](https://github.com/belgattitude/httpx/blob/4dae8c09c15139f4a822e2110336093570f143a3/packages/assert/src/object.types.ts#L9)

## Type Parameters

### TValue

`TValue` *extends* [`BasePlainObject`](../../object.internal.types/type-aliases/BasePlainObject.md) = [`DefaultBasePlainObject`](../../object.internal.types/interfaces/DefaultBasePlainObject.md)
