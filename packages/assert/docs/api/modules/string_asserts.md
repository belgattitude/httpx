[@httpx/assert - v0.6.7](../README.md) / string.asserts

# Module: string.asserts

## Table of contents

### Functions

- [assertParsableSafeInt](string_asserts.md#assertparsablesafeint)
- [assertParsableStrictIsoDateZ](string_asserts.md#assertparsablestrictisodatez)
- [assertStrNotEmpty](string_asserts.md#assertstrnotempty)

## Functions

### assertParsableSafeInt

▸ **assertParsableSafeInt**(`v`, `msgOrErrorFactory?`): asserts v is ParsableSafeInt

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `string` \| () => `Error` |

#### Returns

asserts v is ParsableSafeInt

___

### assertParsableStrictIsoDateZ

▸ **assertParsableStrictIsoDateZ**(`v`, `msgOrErrorFactory?`): asserts v is ParsableStrictIsoDateZ

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `string` \| () => `Error` |

#### Returns

asserts v is ParsableStrictIsoDateZ

**`Throws`**

TypeError

___

### assertStrNotEmpty

▸ **assertStrNotEmpty**(`v`, `msgOrErrorFactory?`): asserts v is string

Assert string is not empty (trims the string by default)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `string` \| () => `Error` |

#### Returns

asserts v is string

**`Throws`**

TypeError
