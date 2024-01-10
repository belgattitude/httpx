[@httpx/assert - v0.6.7](../README.md) / uuid.asserts

# Module: uuid.asserts

## Table of contents

### Functions

- [assertUuid](uuid_asserts.md#assertuuid)
- [assertUuidV1](uuid_asserts.md#assertuuidv1)
- [assertUuidV3](uuid_asserts.md#assertuuidv3)
- [assertUuidV4](uuid_asserts.md#assertuuidv4)
- [assertUuidV5](uuid_asserts.md#assertuuidv5)

## Functions

### assertUuid

▸ **assertUuid**(`v`, `msgOrErrorFactory?`, `options?`): asserts v is Uuid

Asserts a value is a valid uuid v1, v3, v4 or v5
Accept optional version

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |
| `options?` | `Object` |
| `options.version?` | [`UuidVersion`](uuid_types.md#uuidversion) |

#### Returns

asserts v is Uuid

**`Throws`**

TypeError

___

### assertUuidV1

▸ **assertUuidV1**(`v`, `msgOrErrorFactory?`): asserts v is UuidV1

Asserts a value is a valid uuid v1

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is UuidV1

**`Throws`**

TypeError

___

### assertUuidV3

▸ **assertUuidV3**(`v`, `msgOrErrorFactory?`): asserts v is UuidV3

Asserts a value is a valid uuid v3

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is UuidV3

**`Throws`**

TypeError

___

### assertUuidV4

▸ **assertUuidV4**(`v`, `msgOrErrorFactory?`): asserts v is UuidV4

Assert a value is a valid uuid v4

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is UuidV4

**`Throws`**

TypeError

___

### assertUuidV5

▸ **assertUuidV5**(`v`, `msgOrErrorFactory?`): asserts v is UuidV5

Assert a value is a valid uuid v5

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is UuidV5

**`Throws`**

TypeError
