[@httpx/assert - v0.0.1](../README.md) / asserts

# Module: asserts

## Table of contents

### Functions

- [assertPlainObject](asserts.md#assertplainobject)
- [assertStrNotEmpty](asserts.md#assertstrnotempty)
- [assertUuid](asserts.md#assertuuid)
- [assertUuidV1](asserts.md#assertuuidv1)
- [assertUuidV3](asserts.md#assertuuidv3)
- [assertUuidV4](asserts.md#assertuuidv4)
- [assertUuidV5](asserts.md#assertuuidv5)

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

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `v` | `unknown` | `undefined` | - |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` | `undefined` | - |
| `trim` | `boolean` | `true` | auto-trim, default true |

#### Returns

asserts v is string

___

### assertUuid

▸ **assertUuid**(`v`, `msgOrErrorFactory?`, `version?`): asserts v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |
| `version?` | [`UuidVersion`](types.md#uuidversion) |

#### Returns

asserts v is string

___

### assertUuidV1

▸ **assertUuidV1**(`v`, `msgOrErrorFactory?`): asserts v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is string

___

### assertUuidV3

▸ **assertUuidV3**(`v`, `msgOrErrorFactory?`): asserts v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

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

___

### assertUuidV5

▸ **assertUuidV5**(`v`, `msgOrErrorFactory?`): asserts v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is string
