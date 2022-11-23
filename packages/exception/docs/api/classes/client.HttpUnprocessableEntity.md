[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpUnprocessableEntity

# Class: HttpUnprocessableEntity

[client](../modules/client.md).HttpUnprocessableEntity

422 Unprocessable entity (client / webdav specific)

The server understands the content type of the request entity (hence a 415 Unsupported Media Type status code
is inappropriate), and the syntax of the request entity is correct (thus a 400 Bad Request status code is
inappropriate) but was unable to process the contained instructions.

For example, this error condition may occur if an XML request body contains well-formed
(i.e., syntactically correct), but semantically erroneous, XML instructions.

**`See`**

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
- https://httpstatus.in/422/

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpUnprocessableEntity`**

## Table of contents

### Constructors

- [constructor](client.HttpUnprocessableEntity.md#constructor)

### Properties

- [cause](client.HttpUnprocessableEntity.md#cause)
- [code](client.HttpUnprocessableEntity.md#code)
- [errorId](client.HttpUnprocessableEntity.md#errorid)
- [message](client.HttpUnprocessableEntity.md#message)
- [method](client.HttpUnprocessableEntity.md#method)
- [name](client.HttpUnprocessableEntity.md#name)
- [stack](client.HttpUnprocessableEntity.md#stack)
- [statusCode](client.HttpUnprocessableEntity.md#statuscode)
- [url](client.HttpUnprocessableEntity.md#url)
- [STATUS](client.HttpUnprocessableEntity.md#status)
- [prepareStackTrace](client.HttpUnprocessableEntity.md#preparestacktrace)
- [stackTraceLimit](client.HttpUnprocessableEntity.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpUnprocessableEntity.md#capturestacktrace)

## Constructors

### constructor

• **new HttpUnprocessableEntity**(`msgOrParams?`)

#### Parameters

| Name           | Type                                                                         |
| :------------- | :--------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

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

▪ `Static` `Readonly` **STATUS**: `422`

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
