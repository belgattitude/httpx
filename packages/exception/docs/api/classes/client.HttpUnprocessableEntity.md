[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpUnprocessableEntity

# Class: HttpUnprocessableEntity

[client](../modules/client.md).HttpUnprocessableEntity

422 Unprocessable entity (client / webdav specific per RFC / used for validation errors in most apis)

The server understands the content type of the request entity (hence a 415 Unsupported Media Type status code
is inappropriate), and the syntax of the request entity is correct (thus a 400 Bad Request status code is
inappropriate) but was unable to process the contained instructions.

For example, this error condition may occur if an XML request body contains well-formed
(i.e., syntactically correct), but semantically erroneous, XML instructions.

Note that a lot of apis/frameworks uses 422 Unprocessable Entity to indicate (form field) validation errors

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
- [errors](client.HttpUnprocessableEntity.md#errors)
- [issues](client.HttpUnprocessableEntity.md#issues)
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

• **new HttpUnprocessableEntity**(`msgOrParams?`): [`HttpUnprocessableEntity`](client.HttpUnprocessableEntity.md)

#### Parameters

| Name           | Type                                                                                                                                                                                                                                                   |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) & \{ `errors?`: [`HttpValidationIssue`](../modules/types.md#httpvalidationissue)[] } & \{ `issues?`: [`HttpValidationIssue`](../modules/types.md#httpvalidationissue)[] } |

#### Returns

[`HttpUnprocessableEntity`](client.HttpUnprocessableEntity.md)

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

### errors

• `Readonly` **errors**: [`HttpValidationIssue`](../modules/types.md#httpvalidationissue)[]

Errors has been renamed to issues as a better name.

**`Deprecated`**

---

### issues

• `Readonly` **issues**: [`HttpValidationIssue`](../modules/types.md#httpvalidationissue)[]

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

▪ `Static` `Readonly` **STATUS**: `422`

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
