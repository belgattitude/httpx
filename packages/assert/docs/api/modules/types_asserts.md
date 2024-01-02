[@httpx/assert - v0.6.2](../README.md) / types.asserts

# Module: types.asserts

## Table of contents

### Functions

- [assertNever](types_asserts.md#assertnever)
- [assertNeverNoThrow](types_asserts.md#assertnevernothrow)

## Functions

### assertNever

▸ **assertNever**(`v`, `msgOrErrorFactory?`): `never`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `never` |
| `msgOrErrorFactory?` | `string` \| () => `Error` |

#### Returns

`never`

**`Throws`**

TypeError

___

### assertNeverNoThrow

▸ **assertNeverNoThrow**(`v`): `never`

A slight variation of assertNever that doesn't throw in runtime and
will return the value. Typechecks are still enforced.

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `never` |

#### Returns

`never`
