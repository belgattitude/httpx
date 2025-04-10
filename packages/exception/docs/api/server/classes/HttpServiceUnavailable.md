[**@httpx/exception**](../../README.md)

***

[@httpx/exception](../../README.md) / [server](../README.md) / HttpServiceUnavailable

# Class: HttpServiceUnavailable

Construct a new HttpServerException class

## Param

http status code between 500-599, no checks are done on the validity of the number.

## Param

either a message or an object containing HttpExceptionParams

## Extends

- [`HttpServerException`](../../base/classes/HttpServerException.md)

## Constructors

### Constructor

> **new HttpServiceUnavailable**(`msgOrParams?`): `HttpServiceUnavailable`

#### Parameters

##### msgOrParams?

`string` | [`HttpExceptionParams`](../../types/type-aliases/HttpExceptionParams.md)

#### Returns

`HttpServiceUnavailable`

#### Overrides

[`HttpServerException`](../../base/classes/HttpServerException.md).[`constructor`](../../base/classes/HttpServerException.md#constructor)

## Properties

### cause?

> `readonly` `optional` **cause**: `Error` \| [`HttpException`](../../base/classes/HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`cause`](../../base/classes/HttpServerException.md#cause)

***

### code

> `readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`code`](../../base/classes/HttpServerException.md#code)

***

### errorId

> `readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`errorId`](../../base/classes/HttpServerException.md#errorid)

***

### message

> **message**: `string`

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`message`](../../base/classes/HttpServerException.md#message)

***

### method

> `readonly` **method**: `undefined` \| `HttpMethod`

Http method

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`method`](../../base/classes/HttpServerException.md#method)

***

### name

> **name**: `string`

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`name`](../../base/classes/HttpServerException.md#name)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`stack`](../../base/classes/HttpServerException.md#stack)

***

### statusCode

> `readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../../types/type-aliases/HttpErrorStatusCodeOrNumber.md)

Http error status code (400-599)

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`statusCode`](../../base/classes/HttpServerException.md#statuscode)

***

### url

> `readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`url`](../../base/classes/HttpServerException.md#url)

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

[`HttpServerException`](../../base/classes/HttpServerException.md).[`prepareStackTrace`](../../base/classes/HttpServerException.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`HttpServerException`](../../base/classes/HttpServerException.md).[`stackTraceLimit`](../../base/classes/HttpServerException.md#stacktracelimit)

***

### STATUS

> `readonly` `static` **STATUS**: `503` = `status`

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

[`HttpServerException`](../../base/classes/HttpServerException.md).[`captureStackTrace`](../../base/classes/HttpServerException.md#capturestacktrace)
