[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpPayloadTooLarge

# Class: HttpPayloadTooLarge

[client](../modules/client.md).HttpPayloadTooLarge

Construct a new HttpClientException class

**`Param`**

http status code between 400-499, no checks are done on the validity of the number.

**`Param`**

either a message or an object containing HttpExceptionParams

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpPayloadTooLarge`**

## Table of contents

### Constructors

- [constructor](client.HttpPayloadTooLarge.md#constructor)

### Properties

- [cause](client.HttpPayloadTooLarge.md#cause)
- [code](client.HttpPayloadTooLarge.md#code)
- [errorId](client.HttpPayloadTooLarge.md#errorid)
- [message](client.HttpPayloadTooLarge.md#message)
- [method](client.HttpPayloadTooLarge.md#method)
- [name](client.HttpPayloadTooLarge.md#name)
- [stack](client.HttpPayloadTooLarge.md#stack)
- [statusCode](client.HttpPayloadTooLarge.md#statuscode)
- [url](client.HttpPayloadTooLarge.md#url)
- [STATUS](client.HttpPayloadTooLarge.md#status)
- [prepareStackTrace](client.HttpPayloadTooLarge.md#preparestacktrace)
- [stackTraceLimit](client.HttpPayloadTooLarge.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpPayloadTooLarge.md#capturestacktrace)

## Constructors

### constructor

• **new HttpPayloadTooLarge**(`msgOrParams?`): [`HttpPayloadTooLarge`](client.HttpPayloadTooLarge.md)

#### Parameters

| Name           | Type                                                                         |
| :------------- | :--------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

#### Returns

[`HttpPayloadTooLarge`](client.HttpPayloadTooLarge.md)

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

▪ `Static` `Readonly` **STATUS**: `413`

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
