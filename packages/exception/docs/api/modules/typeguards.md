[@httpx/exception](../README.md) / typeguards

# Module: typeguards

## Table of contents

### Functions

- [isHttpClientException](typeguards.md#ishttpclientexception)
- [isHttpErrorStatusCode](typeguards.md#ishttperrorstatuscode)
- [isHttpException](typeguards.md#ishttpexception)
- [isHttpServerException](typeguards.md#ishttpserverexception)
- [isHttpStatusCode](typeguards.md#ishttpstatuscode)

## Functions

### isHttpClientException

▸ **isHttpClientException**(`error`): error is HttpClientException

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `error` | `unknown` |

#### Returns

error is HttpClientException

---

### isHttpErrorStatusCode

▸ **isHttpErrorStatusCode**<`T`\>(`statusCode`): statusCode is T

Check if the provided value is a valid http status code

#### Type parameters

| Name | Type                        |
| :--- | :-------------------------- |
| `T`  | extends `number` = `number` |

#### Parameters

| Name         | Type      |
| :----------- | :-------- |
| `statusCode` | `unknown` |

#### Returns

statusCode is T

---

### isHttpException

▸ **isHttpException**(`error`): error is HttpException

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `error` | `unknown` |

#### Returns

error is HttpException

---

### isHttpServerException

▸ **isHttpServerException**(`error`): error is HttpServerException

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `error` | `unknown` |

#### Returns

error is HttpServerException

---

### isHttpStatusCode

▸ **isHttpStatusCode**(`statusCode`): statusCode is number

Check if the provided value is a valid http status code

#### Parameters

| Name         | Type      |
| :----------- | :-------- |
| `statusCode` | `unknown` |

#### Returns

statusCode is number
