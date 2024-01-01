[@httpx/assert - v0.5.2](../README.md) / array.asserts

# Module: array.asserts

## Table of contents

### Functions

- [assertArrayNonEmpty](array_asserts.md#assertarraynonempty)

## Functions

### assertArrayNonEmpty

▸ **assertArrayNonEmpty**\<`T`\>(`v`, `msgOrErrorFactory?`): asserts v is ArrayNoNEmpty\<T\>

Assert string is not empty (trims the string by default)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `string` \| () => `Error` |

#### Returns

asserts v is ArrayNoNEmpty\<T\>

**`Throws`**

TypeError
