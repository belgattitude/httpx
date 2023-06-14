[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpBadRequest

# Class: HttpBadRequest

[client](../modules/client.md).HttpBadRequest

400 Bad Request (client)

Be aware that a lot of apis/frameworks will use 422 Unprocessable Entity to indicate (form field) validation errors
when posting data (rails, github, api-platform...).

**`See`**

- https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#client-errors

The server cannot or will not process the request due to something that is perceived to be a client error
(e.g., malformed request syntax, invalid request message framing, or deceptive request routing).

- https://httpstatus.in/400/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpBadRequest`**

## Table of contents

### Constructors

- [constructor](client.HttpBadRequest.md#constructor)

### Properties

- [cause](client.HttpBadRequest.md#cause)
- [code](client.HttpBadRequest.md#code)
- [errorId](client.HttpBadRequest.md#errorid)
- [errors](client.HttpBadRequest.md#errors)
- [message](client.HttpBadRequest.md#message)
- [method](client.HttpBadRequest.md#method)
- [name](client.HttpBadRequest.md#name)
- [stack](client.HttpBadRequest.md#stack)
- [statusCode](client.HttpBadRequest.md#statuscode)
- [url](client.HttpBadRequest.md#url)
- [STATUS](client.HttpBadRequest.md#status)
- [prepareStackTrace](client.HttpBadRequest.md#preparestacktrace)
- [stackTraceLimit](client.HttpBadRequest.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpBadRequest.md#capturestacktrace)

## Constructors

### constructor

• **new HttpBadRequest**(`msgOrParams?`)

#### Parameters

| Name           | Type                                                                                                                                                     |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) & { `errors?`: [`ValidationError`](../modules/types.md#validationerror)[] } |

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

### errors

• `Readonly` **errors**: [`ValidationError`](../modules/types.md#validationerror)[]

---

### message

• **message**: `string`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[message](base.HttpClientException.md#message)

---

### method

• `Readonly` **method**: `undefined` \| [`HttpMethod`](../modules/types.md#httpmethod)

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

▪ `Static` `Readonly` **STATUS**: `400`

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
