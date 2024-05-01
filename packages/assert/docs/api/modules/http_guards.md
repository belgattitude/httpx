[@httpx/assert - v0.9.0](../README.md) / http.guards

# Module: http.guards

## Table of contents

### Functions

- [isHttpMethod](http_guards.md#ishttpmethod)
- [isHttpValidMethod](http_guards.md#ishttpvalidmethod)

## Functions

### isHttpMethod

▸ **isHttpMethod**\<`T`\>(`method`, `v`): v is T

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`HttpMethod`](http_types.md#httpmethod) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `T` |
| `v` | `unknown` |

#### Returns

v is T

___

### isHttpValidMethod

▸ **isHttpValidMethod**(`v`): v is HttpMethod

Check whether the value is a valid http method (GET, PUT...) in
a case-insensitive manner.

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `unknown` |

#### Returns

v is HttpMethod
