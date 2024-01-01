[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpUnavailableForLegalReasons

# Class: HttpUnavailableForLegalReasons

[client](../modules/client.md).HttpUnavailableForLegalReasons

451 Unavailable For Legal Reasons (client)

The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.

**`See`**

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
- https://httpstatus.in/451/

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpUnavailableForLegalReasons`**

## Table of contents

### Constructors

- [constructor](client.HttpUnavailableForLegalReasons.md#constructor)

### Properties

- [cause](client.HttpUnavailableForLegalReasons.md#cause)
- [code](client.HttpUnavailableForLegalReasons.md#code)
- [errorId](client.HttpUnavailableForLegalReasons.md#errorid)
- [message](client.HttpUnavailableForLegalReasons.md#message)
- [method](client.HttpUnavailableForLegalReasons.md#method)
- [name](client.HttpUnavailableForLegalReasons.md#name)
- [stack](client.HttpUnavailableForLegalReasons.md#stack)
- [statusCode](client.HttpUnavailableForLegalReasons.md#statuscode)
- [url](client.HttpUnavailableForLegalReasons.md#url)
- [STATUS](client.HttpUnavailableForLegalReasons.md#status)
- [prepareStackTrace](client.HttpUnavailableForLegalReasons.md#preparestacktrace)
- [stackTraceLimit](client.HttpUnavailableForLegalReasons.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpUnavailableForLegalReasons.md#capturestacktrace)

## Constructors

### constructor

• **new HttpUnavailableForLegalReasons**(`msgOrParams?`): [`HttpUnavailableForLegalReasons`](client.HttpUnavailableForLegalReasons.md)

#### Parameters

| Name           | Type                                                                         |
| :------------- | :--------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

#### Returns

[`HttpUnavailableForLegalReasons`](client.HttpUnavailableForLegalReasons.md)

#### Overrides

[HttpClientException](base.HttpClientException.md).[constructor](base.HttpClientException.md#constructor)

## Properties

### cause

• `Optional` `Readonly` **cause**: `Error` \| [`HttpException`](base.HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

**`See`**

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Inherited from

[HttpClientException](base.HttpClientException.md).[cause](base.HttpClientException.md#cause)

---

### code

• `Readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Inherited from

[HttpClientException](base.HttpClientException.md).[code](base.HttpClientException.md#code)

---

### errorId

• `Readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[HttpClientException](base.HttpClientException.md).[errorId](base.HttpClientException.md#errorid)

---

### message

• **message**: `string`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[message](base.HttpClientException.md#message)

---

### method

• `Readonly` **method**: `undefined` \| `"CONNECT"` \| `"DELETE"` \| `"GET"` \| `"HEAD"` \| `"OPTIONS"` \| `"PATCH"` \| `"POST"` \| `"PUT"` \| `"QUERY"` \| `"TRACE"`

Http method

#### Inherited from

[HttpClientException](base.HttpClientException.md).[method](base.HttpClientException.md#method)

---

### name

• **name**: `string`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[name](base.HttpClientException.md#name)

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[stack](base.HttpClientException.md#stack)

---

### statusCode

• `Readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../modules/types.md#httperrorstatuscodeornumber)

Http error status code (400-599)

#### Inherited from

[HttpClientException](base.HttpClientException.md).[statusCode](base.HttpClientException.md#statuscode)

---

### url

• `Readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[HttpClientException](base.HttpClientException.md).[url](base.HttpClientException.md#url)

---

### STATUS

▪ `Static` `Readonly` **STATUS**: `451`

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

[HttpClientException](base.HttpClientException.md).[prepareStackTrace](base.HttpClientException.md#preparestacktrace)

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[stackTraceLimit](base.HttpClientException.md#stacktracelimit)

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

[HttpClientException](base.HttpClientException.md).[captureStackTrace](base.HttpClientException.md#capturestacktrace)
