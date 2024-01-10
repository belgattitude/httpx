[@httpx/exception](../README.md) / [base](../modules/base.md) / HttpException

# Class: HttpException

[base](../modules/base.md).HttpException

## Hierarchy

- `Error`

  ↳ **`HttpException`**

  ↳↳ [`HttpClientException`](base.HttpClientException.md)

  ↳↳ [`HttpServerException`](base.HttpServerException.md)

## Implements

- [`HttpExceptionParams`](../modules/types.md#httpexceptionparams)

## Table of contents

### Constructors

- [constructor](base.HttpException.md#constructor)

### Properties

- [cause](base.HttpException.md#cause)
- [code](base.HttpException.md#code)
- [errorId](base.HttpException.md#errorid)
- [message](base.HttpException.md#message)
- [method](base.HttpException.md#method)
- [name](base.HttpException.md#name)
- [stack](base.HttpException.md#stack)
- [statusCode](base.HttpException.md#statuscode)
- [url](base.HttpException.md#url)
- [prepareStackTrace](base.HttpException.md#preparestacktrace)
- [stackTraceLimit](base.HttpException.md#stacktracelimit)

### Methods

- [captureStackTrace](base.HttpException.md#capturestacktrace)

## Constructors

### constructor

• **new HttpException**(`statusCode`, `msgOrParams?`): [`HttpException`](base.HttpException.md)

Construct a new HttpException class

#### Parameters

| Name           | Type                                                                             | Description                                                                         |
| :------------- | :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| `statusCode`   | [`HttpErrorStatusCodeOrNumber`](../modules/types.md#httperrorstatuscodeornumber) | http status code between 400-599, no checks are done on the validity of the number. |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams)     | either a message or an object containing HttpExceptionParams                        |

#### Returns

[`HttpException`](base.HttpException.md)

#### Overrides

Error.constructor

## Properties

### cause

• `Optional` `Readonly` **cause**: `Error` \| [`HttpException`](base.HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

**`See`**

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Implementation of

HttpExceptionParams.cause

#### Overrides

Error.cause

---

### code

• `Readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)

#### Implementation of

HttpExceptionParams.code

---

### errorId

• `Readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Implementation of

HttpExceptionParams.errorId

---

### message

• **message**: `string`

#### Implementation of

HttpExceptionParams.message

#### Inherited from

Error.message

---

### method

• `Readonly` **method**: `undefined` \| `HttpMethod`

Http method

#### Implementation of

HttpExceptionParams.method

---

### name

• **name**: `string`

#### Inherited from

Error.name

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

---

### statusCode

• `Readonly` **statusCode**: [`HttpErrorStatusCodeOrNumber`](../modules/types.md#httperrorstatuscodeornumber)

Http error status code (400-599)

---

### url

• `Readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Implementation of

HttpExceptionParams.url

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

Error.prepareStackTrace

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

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

Error.captureStackTrace
