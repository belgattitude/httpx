[@httpx/exception](../README.md) / [server](../modules/server.md) / HttpServiceUnavailable

# Class: HttpServiceUnavailable

[server](../modules/server.md).HttpServiceUnavailable

503 Service Unavailable

The server is not ready to handle the request. Common causes are a server that is down for maintenance
or that is overloaded. Note that together with this response, a user-friendly page explaining the problem
should be sent.

This response should be used for temporary conditions and the Retry-After HTTP header should, if possible,
contain the estimated time before the recovery of the service. The webmaster must also take care about the
caching-related headers that are sent along with this response, as these temporary condition responses
should usually not be cached.

**`See`**

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
- https://httpstatus.in/503/

## Hierarchy

- [`HttpServerException`](base.HttpServerException.md)

  ↳ **`HttpServiceUnavailable`**

## Table of contents

### Constructors

- [constructor](server.HttpServiceUnavailable.md#constructor)

### Properties

- [cause](server.HttpServiceUnavailable.md#cause)
- [code](server.HttpServiceUnavailable.md#code)
- [errorId](server.HttpServiceUnavailable.md#errorid)
- [message](server.HttpServiceUnavailable.md#message)
- [method](server.HttpServiceUnavailable.md#method)
- [name](server.HttpServiceUnavailable.md#name)
- [stack](server.HttpServiceUnavailable.md#stack)
- [statusCode](server.HttpServiceUnavailable.md#statuscode)
- [url](server.HttpServiceUnavailable.md#url)
- [STATUS](server.HttpServiceUnavailable.md#status)
- [prepareStackTrace](server.HttpServiceUnavailable.md#preparestacktrace)
- [stackTraceLimit](server.HttpServiceUnavailable.md#stacktracelimit)

### Methods

- [captureStackTrace](server.HttpServiceUnavailable.md#capturestacktrace)

## Constructors

### constructor

• **new HttpServiceUnavailable**(`msgOrParams?`): [`HttpServiceUnavailable`](server.HttpServiceUnavailable.md)

#### Parameters

| Name           | Type                                                                         |
| :------------- | :--------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

#### Returns

[`HttpServiceUnavailable`](server.HttpServiceUnavailable.md)

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

• `Readonly` **statusCode**: `number`

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

▪ `Static` `Readonly` **STATUS**: `503`

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

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
