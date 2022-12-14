[@httpx/exception](../README.md) / [base](../modules/base.md) / HttpServerException

# Class: HttpServerException

[base](../modules/base.md).HttpServerException

Construct a new HttpServerException class

**`Param`**

http status code between 500-599, no checks are done on the validity of the number.

**`Param`**

either a message or an object containing HttpExceptionParams

## Hierarchy

- [`HttpException`](base.HttpException.md)

  ↳ **`HttpServerException`**

  ↳↳ [`HttpBadGateway`](server.HttpBadGateway.md)

  ↳↳ [`HttpVersionNotSupported`](server.HttpVersionNotSupported.md)

  ↳↳ [`HttpGatewayTimeout`](server.HttpGatewayTimeout.md)

  ↳↳ [`HttpInternalServerError`](server.HttpInternalServerError.md)

  ↳↳ [`HttpNetworkAuthenticationRequired`](server.HttpNetworkAuthenticationRequired.md)

  ↳↳ [`HttpNotExtended`](server.HttpNotExtended.md)

  ↳↳ [`HttpNotImplemented`](server.HttpNotImplemented.md)

  ↳↳ [`HttpServiceUnavailable`](server.HttpServiceUnavailable.md)

  ↳↳ [`HttpInsufficientStorage`](server.HttpInsufficientStorage.md)

  ↳↳ [`HttpLoopDetected`](server.HttpLoopDetected.md)

  ↳↳ [`HttpVariantAlsoNegotiates`](server.HttpVariantAlsoNegotiates.md)

## Table of contents

### Constructors

- [constructor](base.HttpServerException.md#constructor)

### Properties

- [cause](base.HttpServerException.md#cause)
- [code](base.HttpServerException.md#code)
- [errorId](base.HttpServerException.md#errorid)
- [message](base.HttpServerException.md#message)
- [method](base.HttpServerException.md#method)
- [name](base.HttpServerException.md#name)
- [stack](base.HttpServerException.md#stack)
- [statusCode](base.HttpServerException.md#statuscode)
- [url](base.HttpServerException.md#url)
- [prepareStackTrace](base.HttpServerException.md#preparestacktrace)
- [stackTraceLimit](base.HttpServerException.md#stacktracelimit)

### Methods

- [captureStackTrace](base.HttpServerException.md#capturestacktrace)

## Constructors

### constructor

• **new HttpServerException**(`statusCode`, `msgOrParams?`)

#### Parameters

| Name           | Type                                                                         |
| :------------- | :--------------------------------------------------------------------------- |
| `statusCode`   | `number`                                                                     |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

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

Custom additional code (ie: 'AbortError', 'CODE-1234'...)

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

• `Readonly` **method**: `undefined` \| [`HttpMethod`](../modules/types.md#httpmethod)

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

• `Readonly` **statusCode**: `number`

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

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

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

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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
