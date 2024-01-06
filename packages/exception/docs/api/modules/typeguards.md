[@httpx/exception](../README.md) / typeguards

# Module: typeguards

## Table of contents

### Functions

- [isErrorWithErrorStatusCode](typeguards.md#iserrorwitherrorstatuscode)
- [isHttpClientException](typeguards.md#ishttpclientexception)
- [isHttpErrorStatusCode](typeguards.md#ishttperrorstatuscode)
- [isHttpException](typeguards.md#ishttpexception)
- [isHttpServerException](typeguards.md#ishttpserverexception)
- [isHttpStatusCode](typeguards.md#ishttpstatuscode)
- [isObjectWithErrorStatusCode](typeguards.md#isobjectwitherrorstatuscode)

## Functions

### isErrorWithErrorStatusCode

▸ **isErrorWithErrorStatusCode**(`error`): error is ErrorWithErrorStatusCode

Checks if a value is an instanceof Error and has a statusCode field
indicating an error http status (4xx or 5xx)

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `error` | `unknown` |

#### Returns

error is ErrorWithErrorStatusCode

---

### isHttpClientException

▸ **isHttpClientException**(`error`, `checkStatusCode?`): error is HttpClientException

Test whether a value is an instanceof HttpClientException
and its statusCode is in the 4xx range when the parameter
checkStatusCode is true (enabled by default).

#### Parameters

| Name              | Type      | Default value | Description                                                             |
| :---------------- | :-------- | :------------ | :---------------------------------------------------------------------- |
| `error`           | `unknown` | `undefined`   | -                                                                       |
| `checkStatusCode` | `boolean` | `true`        | Ensure statusCode is in the client range [>=400, <500], true by default |

#### Returns

error is HttpClientException

---

### isHttpErrorStatusCode

▸ **isHttpErrorStatusCode**\<`T`\>(`statusCode`): statusCode is T

#### Type parameters

| Name | Type                                                                                                                                                  |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `T`  | extends [`HttpErrorStatusCodeOrNumber`](types.md#httperrorstatuscodeornumber) = [`HttpErrorStatusCodeOrNumber`](types.md#httperrorstatuscodeornumber) |

#### Parameters

| Name         | Type      |
| :----------- | :-------- |
| `statusCode` | `unknown` |

#### Returns

statusCode is T

---

### isHttpException

▸ **isHttpException**(`error`, `checkStatusCode?`): error is HttpException

Test whether a value is an instanceof HttpException
and its statusCode is in the 4xx and 5xx ranges when the parameter
checkStatusCode is true (enabled by default).

#### Parameters

| Name              | Type      | Default value |
| :---------------- | :-------- | :------------ |
| `error`           | `unknown` | `undefined`   |
| `checkStatusCode` | `boolean` | `true`        |

#### Returns

error is HttpException

---

### isHttpServerException

▸ **isHttpServerException**(`error`, `checkStatusCode?`): error is HttpServerException

Test whether a value is an instanceof HttpServerException
and its statusCode is in the 5xx range when the parameter
checkStatusCode is true (enabled by default).

#### Parameters

| Name              | Type      | Default value | Description                                                             |
| :---------------- | :-------- | :------------ | :---------------------------------------------------------------------- |
| `error`           | `unknown` | `undefined`   | -                                                                       |
| `checkStatusCode` | `boolean` | `true`        | Ensure statusCode is in the server range [>=500, <600], true by default |

#### Returns

error is HttpServerException

---

### isHttpStatusCode

▸ **isHttpStatusCode**(`statusCode`): statusCode is number

Check if the provided value is a valid http status code > 99 and <600

#### Parameters

| Name         | Type      |
| :----------- | :-------- |
| `statusCode` | `unknown` |

#### Returns

statusCode is number

**`See`**

isHttpErrorStatusCode to ensure error range [4xx,5xx]

---

### isObjectWithErrorStatusCode

▸ **isObjectWithErrorStatusCode**(`objOrPlainObject`): objOrPlainObject is ObjectWithErrorStatusCode

Checks if a value is an object (or a plain object) and has a statusCode field
indicating an error http status (4xx or 5xx)

#### Parameters

| Name               | Type      |
| :----------------- | :-------- |
| `objOrPlainObject` | `unknown` |

#### Returns

objOrPlainObject is ObjectWithErrorStatusCode
