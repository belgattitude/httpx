[@httpx/assert - v0.9.0](../README.md) / http.asserts

# Module: http.asserts

## Table of contents

### Functions

- [assertHttpMethod](http_asserts.md#asserthttpmethod)
- [assertHttpValidMethod](http_asserts.md#asserthttpvalidmethod)

## Functions

### assertHttpMethod

▸ **assertHttpMethod**\<`T`\>(`method`, `v`, `msgOrErrorFactory?`): asserts v is T

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`HttpMethod`](http_types.md#httpmethod) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `T` |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is T

**`Throws`**

TypeError

___

### assertHttpValidMethod

▸ **assertHttpValidMethod**(`v`, `msgOrErrorFactory?`): asserts v is HttpMethod

Assert the value is a valid http method (case-insensitive)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |
| `msgOrErrorFactory?` | `MsgOrErrorFactory` |

#### Returns

asserts v is HttpMethod

**`Throws`**

TypeError
