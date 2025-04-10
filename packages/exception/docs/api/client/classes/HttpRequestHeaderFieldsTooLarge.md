[**@httpx/exception**](../../README.md)

***

[@httpx/exception](../../README.md) / [client](../README.md) / HttpRequestHeaderFieldsTooLarge

# Class: HttpRequestHeaderFieldsTooLarge

Construct a new HttpClientException class

## Param

http status code between 400-499, no checks are done on the validity of the number.

## Param

either a message or an object containing HttpExceptionParams

## Extends

- [`HttpClientException`](../../base/classes/HttpClientException.md)

## Constructors

### Constructor

> **new HttpRequestHeaderFieldsTooLarge**(`msgOrParams?`): `HttpRequestHeaderFieldsTooLarge`

#### Parameters

##### msgOrParams?

`string` | [`HttpExceptionParams`](../../types/type-aliases/HttpExceptionParams.md)

#### Returns

`HttpRequestHeaderFieldsTooLarge`

#### Overrides

[`HttpClientException`](../../base/classes/HttpClientException.md).[`constructor`](../../base/classes/HttpClientException.md#constructor)

## Properties

### cause?

> `readonly` `optional` **cause**: `Error` \| [`HttpException`](../../base/classes/HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`cause`](../../base/classes/HttpClientException.md#cause)

***

### code

> `readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`code`](../../base/classes/HttpClientException.md#code)

***

### errorId

> `readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`errorId`](../../base/classes/HttpClientException.md#errorid)

***

### message

> **message**: `string`

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`message`](../../base/classes/HttpClientException.md#message)

***

### method

> `readonly` **method**: `undefined` \| `HttpMethod`

Http method

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`method`](../../base/classes/HttpClientException.md#method)

***

### name

> **name**: `string`

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`name`](../../base/classes/HttpClientException.md#name)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`stack`](../../base/classes/HttpClientException.md#stack)

***

### statusCode

> `readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../../types/type-aliases/HttpErrorStatusCodeOrNumber.md)

Http error status code (400-599)

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`statusCode`](../../base/classes/HttpClientException.md#statuscode)

***

### url

> `readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`url`](../../base/classes/HttpClientException.md#url)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`prepareStackTrace`](../../base/classes/HttpClientException.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`stackTraceLimit`](../../base/classes/HttpClientException.md#stacktracelimit)

***

### STATUS

> `readonly` `static` **STATUS**: `431` = `status`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

[`HttpClientException`](../../base/classes/HttpClientException.md).[`captureStackTrace`](../../base/classes/HttpClientException.md#capturestacktrace)
