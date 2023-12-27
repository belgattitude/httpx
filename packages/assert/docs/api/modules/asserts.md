[@httpx/assert - v0.0.1](../README.md) / asserts

# Module: asserts

## Table of contents

### Functions

- [assertPlainObject](asserts.md#assertplainobject)
- [assertStrNotEmpty](asserts.md#assertstrnotempty)
- [assertUuidV4](asserts.md#assertuuidv4)

## Functions

### assertPlainObject

▸ **assertPlainObject**(`v`, `msgOrErrorFactory?`): asserts v is string

Assert string is not empty (trims the string by default)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is string

___

### assertStrNotEmpty

▸ **assertStrNotEmpty**(`v`, `msgOrErrorFactory?`, `trim?`): asserts v is string

Assert string is not empty (trims the string by default)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | `unknown` | - |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` | - |
| `trim?` | `boolean` | auto-trim, default true |

#### Returns

asserts v is string

___

### assertUuidV4

▸ **assertUuidV4**(`v`, `msgOrErrorFactory?`): asserts v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is string
