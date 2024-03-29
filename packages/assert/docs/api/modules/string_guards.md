[@httpx/assert - v0.7.0](../README.md) / string.guards

# Module: string.guards

## Table of contents

### Functions

- [isParsableSafeInt](string_guards.md#isparsablesafeint)
- [isParsableStrictIsoDateZ](string_guards.md#isparsablestrictisodatez)
- [isStringNonEmpty](string_guards.md#isstringnonempty)

## Functions

### isParsableSafeInt

▸ **isParsableSafeInt**(`v`): v is ParsableSafeInt

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is ParsableSafeInt

___

### isParsableStrictIsoDateZ

▸ **isParsableStrictIsoDateZ**(`v`): v is ParsableStrictIsoDateZ

Checks if the value is a string containing a valid ISO-8601 date time
with microseconds that ends with 'z' representing UTC+0 timezone (aka zulu time).
Format is 'YYYY-MM-DDTHH:mm:ss.sssZ'. Datetime is checked for validity.

```typescript
isStrParsableIsoDateZ('2023-12-29T23:37:31.653z')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is ParsableStrictIsoDateZ

**`Link`**

https://en.wikipedia.org/wiki/ISO_8601

**`Link`**

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString

**`Link`**

https://en.wikipedia.org/wiki/Coordinated_Universal_Time

___

### isStringNonEmpty

▸ **isStringNonEmpty**(`v`): v is StringNonEmpty

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is StringNonEmpty
