[@httpx/exception](../README.md) / types

# Module: types

## Table of contents

### Type Aliases

- [AssignedStatusCodes](types.md#assignedstatuscodes)
- [HttpExceptionParams](types.md#httpexceptionparams)
- [HttpExceptionParamsWithStatus](types.md#httpexceptionparamswithstatus)
- [HttpMethod](types.md#httpmethod)
- [HttpStatusCode](types.md#httpstatuscode)

## Type Aliases

### AssignedStatusCodes

Ƭ **AssignedStatusCodes**: keyof typeof `statusMap`

___

### HttpExceptionParams

Ƭ **HttpExceptionParams**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cause?` | `Error` | Indicates the original cause of the HttpException. Will be ignored/discarded if the runtime (browser / node version) does not support it or there's no polyfill  **`See`**  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause |
| `code?` | `string` | Custom additional code (ie: 'AbortError', 'CODE-1234'...) |
| `errorId?` | `string` | Inform about an unique error identifier (ie: nanoid, cuid...) |
| `message?` | `string` | Exception message, if not provided the default is the exception name in natural language (ie: "HttpNotFound" -> "Not found") |
| `method?` | ``"GET"`` \| ``"HEAD"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"CONNECT"`` \| ``"OPTIONS"`` \| ``"TRACE"`` \| ``"PATCH"`` | Inform about http method |
| `url?` | `string` | Indicates the original url that caused the error. |

___

### HttpExceptionParamsWithStatus

Ƭ **HttpExceptionParamsWithStatus**: [`HttpExceptionParams`](types.md#httpexceptionparams) & { `statusCode`: [`HttpStatusCode`](types.md#httpstatuscode)  }

___

### HttpMethod

Ƭ **HttpMethod**: ``"GET"`` \| ``"HEAD"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"CONNECT"`` \| ``"OPTIONS"`` \| ``"TRACE"`` \| ``"PATCH"``

___

### HttpStatusCode

Ƭ **HttpStatusCode**: `number`
