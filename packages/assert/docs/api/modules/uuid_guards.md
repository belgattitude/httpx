[@httpx/assert - v0.7.0](../README.md) / uuid.guards

# Module: uuid.guards

## Table of contents

### Functions

- [isUuid](uuid_guards.md#isuuid)
- [isUuidV1](uuid_guards.md#isuuidv1)
- [isUuidV3](uuid_guards.md#isuuidv3)
- [isUuidV4](uuid_guards.md#isuuidv4)
- [isUuidV5](uuid_guards.md#isuuidv5)
- [isUuidVersion](uuid_guards.md#isuuidversion)

## Functions

### isUuid

▸ **isUuid**(`v`, `version?`): v is Uuid

Check whether a value is string and passes uuid validation with
optional given version

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `version?` | [`UuidVersion`](uuid_types.md#uuidversion) |

#### Returns

v is Uuid

___

### isUuidV1

▸ **isUuidV1**(`v`): v is UuidV1

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is UuidV1

___

### isUuidV3

▸ **isUuidV3**(`v`): v is UuidV3

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is UuidV3

___

### isUuidV4

▸ **isUuidV4**(`v`): v is UuidV4

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is UuidV4

___

### isUuidV5

▸ **isUuidV5**(`v`): v is UuidV5

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is UuidV5

___

### isUuidVersion

▸ **isUuidVersion**(`v`): v is UuidVersion

Check if a value is a valid uuid version: 1, 3, 4 or 5

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is UuidVersion
