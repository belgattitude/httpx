[**@httpx/assert v0.16.9**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.types](../README.md) / PlainObject

# Type Alias: PlainObject\<TValue\>

> **PlainObject**\<`TValue`\> = `TValue` *extends* [`DefaultBasePlainObject`](../../object.internal.types/interfaces/DefaultBasePlainObject.md) ? `Record`\<[`PlainObjectKey`](../../object.internal.types/type-aliases/PlainObjectKey.md), `unknown`\> : `Simplify`\<[`PlainObjectDeepPartialUnknown`](../../object.internal.types/type-aliases/PlainObjectDeepPartialUnknown.md)\<`TValue`\>\>

Defined in: [object.types.ts:9](https://github.com/belgattitude/httpx/blob/ead3a5e210bc10c98f666387bc1b821279c79c49/packages/assert/src/object.types.ts#L9)

## Type Parameters

### TValue

`TValue` *extends* [`BasePlainObject`](../../object.internal.types/type-aliases/BasePlainObject.md) = [`DefaultBasePlainObject`](../../object.internal.types/interfaces/DefaultBasePlainObject.md)
