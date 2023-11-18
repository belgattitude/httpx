[@httpx/exception](../README.md) / types

# Module: types

## Table of contents

### Type Aliases

- [HttpExceptionParams](types.md#httpexceptionparams)
- [HttpExceptionParamsWithStatus](types.md#httpexceptionparamswithstatus)
- [HttpStatusCode](types.md#httpstatuscode)
- [HttpValidationIssue](types.md#httpvalidationissue)
- [ValidationError](types.md#validationerror)

## Type Aliases

### HttpExceptionParams

Ƭ **HttpExceptionParams**: `Object`

#### Type declaration

| Name       | Type         | Description                                                                                                                                                                                                                                                            |
| :--------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cause?`   | `Error`      | Indicates the original cause of the HttpException. Will be ignored/discarded if the runtime (browser / node version) does not support it or there's no polyfill **`See`** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause |
| `code?`    | `string`     | Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...) Do not use this to indicate http status code, the `statusCode` is built-in.                                                                          |
| `errorId?` | `string`     | Inform about an unique error identifier (ie: nanoid, cuid, sentry...)                                                                                                                                                                                                  |
| `message?` | `string`     | Exception message, if not provided the default is the exception name in natural language (ie: "HttpNotFound" -> "Not found")                                                                                                                                           |
| `method?`  | `HttpMethod` | Inform about http method                                                                                                                                                                                                                                               |
| `url?`     | `string`     | Indicates the original url that caused the error.                                                                                                                                                                                                                      |

---

### HttpExceptionParamsWithStatus

Ƭ **HttpExceptionParamsWithStatus**: [`HttpExceptionParams`](types.md#httpexceptionparams) & \{ `statusCode`: [`HttpStatusCode`](types.md#httpstatuscode) }

---

### HttpStatusCode

Ƭ **HttpStatusCode**: keyof typeof `statusMap`

---

### HttpValidationIssue

Ƭ **HttpValidationIssue**: `Object`

Related to HttpBadRequest, HttpValidationIssue contains additional validation info.
Slightly inspired from https://jsonapi.org/format/1.2/#error-objects
and zod (path).

#### Type declaration

| Name      | Type                                 | Description                                                      |
| :-------- | :----------------------------------- | :--------------------------------------------------------------- |
| `code?`   | `string`                             | An application-specific error code, expressed as a string value. |
| `message` | `string`                             | A short, human-readable summary of the problem                   |
| `path`    | (`number` \| `string`)[] \| `string` | Param name or path, ie: 'email' or ['addresses', 0, 'line1']     |

---

### ValidationError

Ƭ **ValidationError**: [`HttpValidationIssue`](types.md#httpvalidationissue)

Alias to HttpValidationIssue for backward compatibility

**`Deprecated`**

replaced by HttpValidationIssue
