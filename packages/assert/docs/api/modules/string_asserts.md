[@httpx/assert - v0.6.7](../README.md) / string.asserts

# Module: string.asserts

## Table of contents

### Functions

- [assertParsableSafeInt](string_asserts.md#assertparsablesafeint)
- [assertParsableStrictIsoDateZ](string_asserts.md#assertparsablestrictisodatez)
- [assertStringNonEmpty](string_asserts.md#assertstringnonempty)

## Functions

### assertParsableSafeInt

▸ **assertParsableSafeInt**(`v`, `msgOrErrorFactory?`): asserts v is ParsableSafeInt

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is ParsableSafeInt

___

### assertParsableStrictIsoDateZ

▸ **assertParsableStrictIsoDateZ**(`v`, `msgOrErrorFactory?`): asserts v is ParsableStrictIsoDateZ

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is ParsableStrictIsoDateZ

**`Throws`**

TypeError

___

### assertStringNonEmpty

▸ **assertStringNonEmpty**(`v`, `msgOrErrorFactory?`): asserts v is StringNonEmpty

Assert string is not empty (trims the string by default)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is StringNonEmpty

**`Throws`**

TypeError
