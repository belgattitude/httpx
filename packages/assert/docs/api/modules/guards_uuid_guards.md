[@httpx/assert - v0.1.0](../README.md) / guards/uuid.guards

# Module: guards/uuid.guards

## Table of contents

### Functions

- [isUuid](guards_uuid_guards.md#isuuid)
- [isUuidV1](guards_uuid_guards.md#isuuidv1)
- [isUuidV3](guards_uuid_guards.md#isuuidv3)
- [isUuidV4](guards_uuid_guards.md#isuuidv4)
- [isUuidV5](guards_uuid_guards.md#isuuidv5)
- [isUuidVersion](guards_uuid_guards.md#isuuidversion)

## Functions

### isUuid

▸ **isUuid**(`v`, `version?`): v is string

Check whether a value is string and passes uuid validation with
optional given version

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `version?` | [`UuidVersion`](types_uuid_types.md#uuidversion) |

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
