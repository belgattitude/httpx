[@httpx/exception](../README.md) / [server](../modules/server.md) / HttpGatewayTimeout

# Class: HttpGatewayTimeout

[server](../modules/server.md).HttpGatewayTimeout

504 Gateway Timeout (server)

This error response is given when the server is acting as a gateway and cannot get a response in time.

**`See`**

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
- https://httpstatus.in/504/

## Hierarchy

- [`HttpServerException`](base.HttpServerException.md)

  ↳ **`HttpGatewayTimeout`**

## Table of contents

### Constructors

- [constructor](server.HttpGatewayTimeout.md#constructor)

### Properties

- [cause](server.HttpGatewayTimeout.md#cause)
- [code](server.HttpGatewayTimeout.md#code)
- [errorId](server.HttpGatewayTimeout.md#errorid)
- [message](server.HttpGatewayTimeout.md#message)
- [method](server.HttpGatewayTimeout.md#method)
- [name](server.HttpGatewayTimeout.md#name)
- [stack](server.HttpGatewayTimeout.md#stack)
- [statusCode](server.HttpGatewayTimeout.md#statuscode)
- [url](server.HttpGatewayTimeout.md#url)
- [STATUS](server.HttpGatewayTimeout.md#status)
- [prepareStackTrace](server.HttpGatewayTimeout.md#preparestacktrace)
- [stackTraceLimit](server.HttpGatewayTimeout.md#stacktracelimit)

### Methods

- [captureStackTrace](server.HttpGatewayTimeout.md#capturestacktrace)

## Constructors

### constructor

• **new HttpGatewayTimeout**(`msgOrParams?`): [`HttpGatewayTimeout`](server.HttpGatewayTimeout.md)

#### Parameters

| Name           | Type                                                                         |
| :------------- | :--------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

#### Returns

[`HttpGatewayTimeout`](server.HttpGatewayTimeout.md)

#### Overrides

[HttpServerException](base.HttpServerException.md).[constructor](base.HttpServerException.md#constructor)

## Properties

### cause

• `Optional` `Readonly` **cause**: `Error` \| [`HttpException`](base.HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

**`See`**

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Inherited from

[HttpServerException](base.HttpServerException.md).[cause](base.HttpServerException.md#cause)

---

### code

• `Readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Inherited from

[HttpServerException](base.HttpServerException.md).[code](base.HttpServerException.md#code)

---

### errorId

• `Readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[HttpServerException](base.HttpServerException.md).[errorId](base.HttpServerException.md#errorid)

---

### message

• **message**: `string`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[message](base.HttpServerException.md#message)

---

### method

• `Readonly` **method**: `undefined` \| `HttpMethod`

Http method

#### Inherited from

[HttpServerException](base.HttpServerException.md).[method](base.HttpServerException.md#method)

---

### name

• **name**: `string`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[name](base.HttpServerException.md#name)

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[stack](base.HttpServerException.md#stack)

---

### statusCode

• `Readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../modules/types.md#httperrorstatuscodeornumber)

Http error status code (400-599)

#### Inherited from

[HttpServerException](base.HttpServerException.md).[statusCode](base.HttpServerException.md#statuscode)

---

### url

• `Readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[HttpServerException](base.HttpServerException.md).[url](base.HttpServerException.md#url)

---

### STATUS

▪ `Static` `Readonly` **STATUS**: `504`

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name          | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[HttpServerException](base.HttpServerException.md).[prepareStackTrace](base.HttpServerException.md#preparestacktrace)

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[stackTraceLimit](base.HttpServerException.md#stacktracelimit)

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

[HttpServerException](base.HttpServerException.md).[captureStackTrace](base.HttpServerException.md#capturestacktrace)
