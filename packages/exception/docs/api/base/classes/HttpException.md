[**@httpx/exception**](../../README.md)

***

[@httpx/exception](../../README.md) / [base](../README.md) / HttpException

# Class: HttpException

## Extends

- `Error`

## Extended by

- [`HttpClientException`](HttpClientException.md)
- [`HttpServerException`](HttpServerException.md)

## Implements

- [`HttpExceptionParams`](../../types/type-aliases/HttpExceptionParams.md)

## Constructors

### Constructor

> **new HttpException**(`statusCode`, `msgOrParams?`): `HttpException`

Construct a new HttpException class

#### Parameters

##### statusCode

[`HttpErrorStatusCodeOrNumber`](../../types/type-aliases/HttpErrorStatusCodeOrNumber.md)

http status code between 400-599, no checks are done on the validity of the number.

##### msgOrParams?

either a message or an object containing HttpExceptionParams

`string` | [`HttpExceptionParams`](../../types/type-aliases/HttpExceptionParams.md)

#### Returns

`HttpException`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `readonly` `optional` **cause**: `Error` \| `HttpException`

If set and the runtime (browser or node) supports it
you can get back the error cause

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Implementation of

`HttpExceptionParams.cause`

#### Overrides

`Error.cause`

***

### code

> `readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Implementation of

`HttpExceptionParams.code`

***

### errorId

> `readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Implementation of

`HttpExceptionParams.errorId`

***

### message

> **message**: `string`

#### Implementation of

`HttpExceptionParams.message`

#### Inherited from

`Error.message`

***

### method

> `readonly` **method**: `undefined` \| `HttpMethod`

Http method

#### Implementation of

`HttpExceptionParams.method`

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

***

### statusCode

> `readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../../types/type-aliases/HttpErrorStatusCodeOrNumber.md)

Http error status code (400-599)

***

### url

> `readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Implementation of

`HttpExceptionParams.url`

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

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`
