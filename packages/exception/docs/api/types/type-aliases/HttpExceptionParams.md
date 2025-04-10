[**@httpx/exception**](../../README.md)

***

[@httpx/exception](../../README.md) / [types](../README.md) / HttpExceptionParams

# Type Alias: HttpExceptionParams

> **HttpExceptionParams** = `object`

## Properties

### cause?

> `optional` **cause**: `Error` \| [`HttpException`](../../base/classes/HttpException.md)

Indicates the original cause of the HttpException.
Will be ignored/discarded if the runtime (browser / node version) does not support it
or there's no polyfill

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

***

### code?

> `optional` **code**: `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)
Do not use this to indicate http status code, the `statusCode` is built-in.

***

### errorId?

> `optional` **errorId**: `string`

Inform about an unique error identifier (ie: nanoid, cuid, sentry...)

***

### message?

> `optional` **message**: `string`

Exception message, if not provided the default is the exception
name in natural language (ie: "HttpNotFound" -> "Not found")

***

### method?

> `optional` **method**: `HttpMethod`

Inform about http method

***

### url?

> `optional` **url**: `string`

Indicates the original url that caused the error.
