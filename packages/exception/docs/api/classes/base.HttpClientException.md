[@httpx/exception](../README.md) / [base](../modules/base.md) / HttpClientException

# Class: HttpClientException

[base](../modules/base.md).HttpClientException

Construct a new HttpClientException class

**`Param`**

http status code between 400-499, no checks are done on the validity of the number.

**`Param`**

either a message or an object containing HttpExceptionParams

## Hierarchy

- [`HttpException`](base.HttpException.md)

  ↳ **`HttpClientException`**

  ↳↳ [`HttpBadRequest`](client.HttpBadRequest.md)

  ↳↳ [`HttpConflict`](client.HttpConflict.md)

  ↳↳ [`HttpExpectationFailed`](client.HttpExpectationFailed.md)

  ↳↳ [`HttpFailedDependency`](client.HttpFailedDependency.md)

  ↳↳ [`HttpForbidden`](client.HttpForbidden.md)

  ↳↳ [`HttpGone`](client.HttpGone.md)

  ↳↳ [`HttpImATeapot`](client.HttpImATeapot.md)

  ↳↳ [`HttpLengthRequired`](client.HttpLengthRequired.md)

  ↳↳ [`HttpLocked`](client.HttpLocked.md)

  ↳↳ [`HttpMethodNotAllowed`](client.HttpMethodNotAllowed.md)

  ↳↳ [`HttpMisdirectedRequest`](client.HttpMisdirectedRequest.md)

  ↳↳ [`HttpNotAcceptable`](client.HttpNotAcceptable.md)

  ↳↳ [`HttpNotFound`](client.HttpNotFound.md)

  ↳↳ [`HttpPayloadTooLarge`](client.HttpPayloadTooLarge.md)

  ↳↳ [`HttpPaymentRequired`](client.HttpPaymentRequired.md)

  ↳↳ [`HttpPreconditionFailed`](client.HttpPreconditionFailed.md)

  ↳↳ [`HttpPreconditionRequired`](client.HttpPreconditionRequired.md)

  ↳↳ [`HttpProxyAuthenticationRequired`](client.HttpProxyAuthenticationRequired.md)

  ↳↳ [`HttpRangeNotSatisfiable`](client.HttpRangeNotSatisfiable.md)

  ↳↳ [`HttpRequestHeaderFieldsTooLarge`](client.HttpRequestHeaderFieldsTooLarge.md)

  ↳↳ [`HttpRequestTimeout`](client.HttpRequestTimeout.md)

  ↳↳ [`HttpTooEarly`](client.HttpTooEarly.md)

  ↳↳ [`HttpTooManyRequests`](client.HttpTooManyRequests.md)

  ↳↳ [`HttpUnauthorized`](client.HttpUnauthorized.md)

  ↳↳ [`HttpUnavailableForLegalReasons`](client.HttpUnavailableForLegalReasons.md)

  ↳↳ [`HttpUnprocessableEntity`](client.HttpUnprocessableEntity.md)

  ↳↳ [`HttpUnsupportedMediaType`](client.HttpUnsupportedMediaType.md)

  ↳↳ [`HttpUpgradeRequired`](client.HttpUpgradeRequired.md)

  ↳↳ [`HttpUriTooLong`](client.HttpUriTooLong.md)

## Table of contents

### Constructors

- [constructor](base.HttpClientException.md#constructor)

### Properties

- [cause](base.HttpClientException.md#cause)
- [code](base.HttpClientException.md#code)
- [errorId](base.HttpClientException.md#errorid)
- [message](base.HttpClientException.md#message)
- [method](base.HttpClientException.md#method)
- [name](base.HttpClientException.md#name)
- [stack](base.HttpClientException.md#stack)
- [statusCode](base.HttpClientException.md#statuscode)
- [url](base.HttpClientException.md#url)
- [prepareStackTrace](base.HttpClientException.md#preparestacktrace)
- [stackTraceLimit](base.HttpClientException.md#stacktracelimit)

### Methods

- [captureStackTrace](base.HttpClientException.md#capturestacktrace)

## Constructors

### constructor

• **new HttpClientException**(`statusCode`, `msgOrParams?`): [`HttpClientException`](base.HttpClientException.md)

#### Parameters

| Name           | Type                                                                             |
| :------------- | :------------------------------------------------------------------------------- |
| `statusCode`   | [`HttpErrorStatusCodeOrNumber`](../modules/types.md#httperrorstatuscodeornumber) |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams)     |

#### Returns

[`HttpClientException`](base.HttpClientException.md)

#### Overrides

[HttpException](base.HttpException.md).[constructor](base.HttpException.md#constructor)

## Properties

### cause

• `Optional` `Readonly` **cause**: `Error` \| [`HttpException`](base.HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

**`See`**

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Inherited from

[HttpException](base.HttpException.md).[cause](base.HttpException.md#cause)

---

### code

• `Readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Inherited from

[HttpException](base.HttpException.md).[code](base.HttpException.md#code)

---

### errorId

• `Readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[HttpException](base.HttpException.md).[errorId](base.HttpException.md#errorid)

---

### message

• **message**: `string`

#### Inherited from

[HttpException](base.HttpException.md).[message](base.HttpException.md#message)

---

### method

• `Readonly` **method**: `undefined` \| `HttpMethod`

Http method

#### Inherited from

[HttpException](base.HttpException.md).[method](base.HttpException.md#method)

---

### name

• **name**: `string`

#### Inherited from

[HttpException](base.HttpException.md).[name](base.HttpException.md#name)

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[HttpException](base.HttpException.md).[stack](base.HttpException.md#stack)

---

### statusCode

• `Readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../modules/types.md#httperrorstatuscodeornumber)

Http error status code (400-599)

#### Inherited from

[HttpException](base.HttpException.md).[statusCode](base.HttpException.md#statuscode)

---

### url

• `Readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[HttpException](base.HttpException.md).[url](base.HttpException.md#url)

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

##### Parameters

| Name          | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[HttpException](base.HttpException.md).[prepareStackTrace](base.HttpException.md#preparestacktrace)

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[HttpException](base.HttpException.md).[stackTraceLimit](base.HttpException.md#stacktracelimit)

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[HttpException](base.HttpException.md).[captureStackTrace](base.HttpException.md#capturestacktrace)
