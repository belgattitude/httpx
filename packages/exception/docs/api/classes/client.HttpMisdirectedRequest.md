[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpMisdirectedRequest

# Class: HttpMisdirectedRequest

[client](../modules/client.md).HttpMisdirectedRequest

421 Misdirected Request (client)

The request was directed at a server that is not able to produce a response. This can be sent by a server that
is not configured to produce responses for the combination of scheme and authority that are included
in the request URI.

**`See`**

https://httpstatus.in/421/

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpMisdirectedRequest`**

## Table of contents

### Constructors

- [constructor](client.HttpMisdirectedRequest.md#constructor)

### Properties

- [cause](client.HttpMisdirectedRequest.md#cause)
- [code](client.HttpMisdirectedRequest.md#code)
- [errorId](client.HttpMisdirectedRequest.md#errorid)
- [message](client.HttpMisdirectedRequest.md#message)
- [method](client.HttpMisdirectedRequest.md#method)
- [name](client.HttpMisdirectedRequest.md#name)
- [stack](client.HttpMisdirectedRequest.md#stack)
- [statusCode](client.HttpMisdirectedRequest.md#statuscode)
- [url](client.HttpMisdirectedRequest.md#url)
- [STATUS](client.HttpMisdirectedRequest.md#status)
- [prepareStackTrace](client.HttpMisdirectedRequest.md#preparestacktrace)
- [stackTraceLimit](client.HttpMisdirectedRequest.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpMisdirectedRequest.md#capturestacktrace)

## Constructors

### constructor

• **new HttpMisdirectedRequest**(`msgOrParams?`)

#### Parameters

| Name           | Type                              |
| :------------- | :-------------------------------- |
| `msgOrParams?` | `string` \| `HttpExceptionParams` |

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

Custom additional code (ie: 'AbortError', 'CODE-1234'...)

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

• `Readonly` **method**: `undefined` \| `HttpMethod`

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

• `Readonly` **statusCode**: `number`

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

▪ `Static` `Readonly` **STATUS**: `421`

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

[HttpClientException](base.HttpClientException.md).[prepareStackTrace](base.HttpClientException.md#preparestacktrace)

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[stackTraceLimit](base.HttpClientException.md#stacktracelimit)

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

[HttpClientException](base.HttpClientException.md).[captureStackTrace](base.HttpClientException.md#capturestacktrace)
