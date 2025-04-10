[**@httpx/exception**](../../README.md)

***

[@httpx/exception](../../README.md) / [base](../README.md) / HttpClientException

# Class: HttpClientException

Construct a new HttpClientException class

## Param

http status code between 400-499, no checks are done on the validity of the number.

## Param

either a message or an object containing HttpExceptionParams

## Extends

- [`HttpException`](HttpException.md)

## Extended by

- [`HttpBadRequest`](../../client/classes/HttpBadRequest.md)
- [`HttpConflict`](../../client/classes/HttpConflict.md)
- [`HttpExpectationFailed`](../../client/classes/HttpExpectationFailed.md)
- [`HttpFailedDependency`](../../client/classes/HttpFailedDependency.md)
- [`HttpForbidden`](../../client/classes/HttpForbidden.md)
- [`HttpGone`](../../client/classes/HttpGone.md)
- [`HttpImATeapot`](../../client/classes/HttpImATeapot.md)
- [`HttpLengthRequired`](../../client/classes/HttpLengthRequired.md)
- [`HttpLocked`](../../client/classes/HttpLocked.md)
- [`HttpMethodNotAllowed`](../../client/classes/HttpMethodNotAllowed.md)
- [`HttpMisdirectedRequest`](../../client/classes/HttpMisdirectedRequest.md)
- [`HttpNotAcceptable`](../../client/classes/HttpNotAcceptable.md)
- [`HttpNotFound`](../../client/classes/HttpNotFound.md)
- [`HttpPayloadTooLarge`](../../client/classes/HttpPayloadTooLarge.md)
- [`HttpPaymentRequired`](../../client/classes/HttpPaymentRequired.md)
- [`HttpPreconditionFailed`](../../client/classes/HttpPreconditionFailed.md)
- [`HttpPreconditionRequired`](../../client/classes/HttpPreconditionRequired.md)
- [`HttpProxyAuthenticationRequired`](../../client/classes/HttpProxyAuthenticationRequired.md)
- [`HttpRangeNotSatisfiable`](../../client/classes/HttpRangeNotSatisfiable.md)
- [`HttpRequestHeaderFieldsTooLarge`](../../client/classes/HttpRequestHeaderFieldsTooLarge.md)
- [`HttpRequestTimeout`](../../client/classes/HttpRequestTimeout.md)
- [`HttpTooEarly`](../../client/classes/HttpTooEarly.md)
- [`HttpTooManyRequests`](../../client/classes/HttpTooManyRequests.md)
- [`HttpUnauthorized`](../../client/classes/HttpUnauthorized.md)
- [`HttpUnavailableForLegalReasons`](../../client/classes/HttpUnavailableForLegalReasons.md)
- [`HttpUnprocessableEntity`](../../client/classes/HttpUnprocessableEntity.md)
- [`HttpUnsupportedMediaType`](../../client/classes/HttpUnsupportedMediaType.md)
- [`HttpUpgradeRequired`](../../client/classes/HttpUpgradeRequired.md)
- [`HttpUriTooLong`](../../client/classes/HttpUriTooLong.md)

## Constructors

### Constructor

> **new HttpClientException**(`statusCode`, `msgOrParams?`): `HttpClientException`

#### Parameters

##### statusCode

[`HttpErrorStatusCodeOrNumber`](../../types/type-aliases/HttpErrorStatusCodeOrNumber.md)

##### msgOrParams?

`string` | [`HttpExceptionParams`](../../types/type-aliases/HttpExceptionParams.md)

#### Returns

`HttpClientException`

#### Overrides

[`HttpException`](HttpException.md).[`constructor`](HttpException.md#constructor)

## Properties

### cause?

> `readonly` `optional` **cause**: `Error` \| [`HttpException`](HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Inherited from

[`HttpException`](HttpException.md).[`cause`](HttpException.md#cause)

***

### code

> `readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Inherited from

[`HttpException`](HttpException.md).[`code`](HttpException.md#code)

***

### errorId

> `readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[`HttpException`](HttpException.md).[`errorId`](HttpException.md#errorid)

***

### message

> **message**: `string`

#### Inherited from

[`HttpException`](HttpException.md).[`message`](HttpException.md#message)

***

### method

> `readonly` **method**: `undefined` \| `HttpMethod`

Http method

#### Inherited from

[`HttpException`](HttpException.md).[`method`](HttpException.md#method)

***

### name

> **name**: `string`

#### Inherited from

[`HttpException`](HttpException.md).[`name`](HttpException.md#name)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`HttpException`](HttpException.md).[`stack`](HttpException.md#stack)

***

### statusCode

> `readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../../types/type-aliases/HttpErrorStatusCodeOrNumber.md)

Http error status code (400-599)

#### Inherited from

[`HttpException`](HttpException.md).[`statusCode`](HttpException.md#statuscode)

***

### url

> `readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[`HttpException`](HttpException.md).[`url`](HttpException.md#url)

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

[`HttpException`](HttpException.md).[`prepareStackTrace`](HttpException.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`HttpException`](HttpException.md).[`stackTraceLimit`](HttpException.md#stacktracelimit)

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

[`HttpException`](HttpException.md).[`captureStackTrace`](HttpException.md#capturestacktrace)
