[@httpx/assert - v0.0.1](../README.md) / guards

# Module: guards

## Table of contents

### Functions

- [isPlainObject](guards.md#isplainobject)
- [isStrNotEmpty](guards.md#isstrnotempty)
- [isUuid](guards.md#isuuid)
- [isUuidV1](guards.md#isuuidv1)
- [isUuidV3](guards.md#isuuidv3)
- [isUuidV4](guards.md#isuuidv4)
- [isUuidV5](guards.md#isuuidv5)
- [isUuidVersion](guards.md#isuuidversion)

## Functions

### isPlainObject

▸ **isPlainObject**\<`T`, `K`\>(`v`): v is PlainObject\<T, K\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |
| `K` | extends `string` \| `number` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is PlainObject\<T, K\>

___

### isStrNotEmpty

▸ **isStrNotEmpty**(`v`, `trim?`): v is string

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `v` | `unknown` | `undefined` |
| `trim` | `boolean` | `true` |

#### Returns

v is string

___

### isUuid

▸ **isUuid**(`v`, `version?`): v is string

Check whether a value is string and passes uuid validation with
optional given version

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `version?` | [`UuidVersion`](types.md#uuidversion) |

#### Returns

v is string

___

### isUuidV1

▸ **isUuidV1**(`v`): v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is string

___

### isUuidV3

▸ **isUuidV3**(`v`): v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is string

___

### isUuidV4

▸ **isUuidV4**(`v`): v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is string

___

### isUuidV5

▸ **isUuidV5**(`v`): v is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is string

___

### isUuidVersion

▸ **isUuidVersion**(`v`): v is UuidVersion

Check whether a value is a valid uuid integer supported version

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is UuidVersion
