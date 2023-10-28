@httpx/json-api

# @httpx/json-api - v0.4.1

## Table of contents

### Classes

- [JsonApiErrorFactory](classes/JsonApiErrorFactory.md)
- [JsonApiResponseFactory](classes/JsonApiResponseFactory.md)

### Type Aliases

- [JsonApiError](README.md#jsonapierror)
- [JsonApiErrorResponse](README.md#jsonapierrorresponse)
- [JsonApiResponse](README.md#jsonapiresponse)
- [JsonApiResponseMeta](README.md#jsonapiresponsemeta)
- [JsonApiSuccessResponse](README.md#jsonapisuccessresponse)

### Functions

- [isJsonApiErrorResponse](README.md#isjsonapierrorresponse)
- [isJsonApiResponse](README.md#isjsonapiresponse)
- [isJsonApiSuccessResponse](README.md#isjsonapisuccessresponse)

## Type Aliases

### JsonApiError

Ƭ **JsonApiError**: `Object`

**`Link`**

https://jsonapi.org/format/#errors

#### Type declaration

| Name         | Type                           | Description                                                                                                                                              |
| :----------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code?`      | `string`                       | an application-specific error code, expressed as a string value.                                                                                         |
| `detail?`    | `string`                       | a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.                                |
| `id?`        | `string` \| `number`           | a unique identifier for this particular occurrence of the problem.                                                                                       |
| `meta?`      | `Record`<`string`, `unknown`\> | a meta object containing non-standard meta-information about the error.                                                                                  |
| `parameter?` | `string`                       | a string indicating which URI query parameter caused the error.                                                                                          |
| `status?`    | `number`                       | the HTTP status code applicable to this problem, expressed as a string value.                                                                            |
| `title`      | `string`                       | a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization. |

---

### JsonApiErrorResponse

Ƭ **JsonApiErrorResponse**: `Object`

#### Type declaration

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `errors`  | [`JsonApiError`](README.md#jsonapierror)[] |
| `success` | `false`                                    |

---

### JsonApiResponse

Ƭ **JsonApiResponse**<`T`\>: [`JsonApiErrorResponse`](README.md#jsonapierrorresponse) \| [`JsonApiSuccessResponse`](README.md#jsonapisuccessresponse)<`T`\>

#### Type parameters

| Name |
| :--- |
| `T`  |

---

### JsonApiResponseMeta

Ƭ **JsonApiResponseMeta**: `Object`

#### Type declaration

| Name    | Type                                                                                                                  |
| :------ | :-------------------------------------------------------------------------------------------------------------------- |
| `meta?` | { `cacheHit?`: `boolean` } & `Record`<`string`, `string` \| `number` \| `boolean` \| `Record`<`string`, `unknown`\>\> |

---

### JsonApiSuccessResponse

Ƭ **JsonApiSuccessResponse**<`T`\>: { `data`: `T` ; `success`: `true` } & [`JsonApiResponseMeta`](README.md#jsonapiresponsemeta)

#### Type parameters

| Name |
| :--- |
| `T`  |

## Functions

### isJsonApiErrorResponse

▸ **isJsonApiErrorResponse**(`val`): val is JsonApiErrorResponse

#### Parameters

| Name  | Type      |
| :---- | :-------- |
| `val` | `unknown` |

#### Returns

val is JsonApiErrorResponse

---

### isJsonApiResponse

▸ **isJsonApiResponse**<`T`\>(`val`): val is JsonApiResponse<T\>

#### Type parameters

| Name | Type      |
| :--- | :-------- |
| `T`  | `unknown` |

#### Parameters

| Name  | Type      |
| :---- | :-------- |
| `val` | `unknown` |

#### Returns

val is JsonApiResponse<T\>

---

### isJsonApiSuccessResponse

▸ **isJsonApiSuccessResponse**<`T`\>(`val`): val is JsonApiSuccessResponse<T\>

#### Type parameters

| Name | Type      |
| :--- | :-------- |
| `T`  | `unknown` |

#### Parameters

| Name  | Type      |
| :---- | :-------- |
| `val` | `unknown` |

#### Returns

val is JsonApiSuccessResponse<T\>
