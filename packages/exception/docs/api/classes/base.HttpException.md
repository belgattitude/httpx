[@httpx/exception](../README.md) / [base](../modules/base.md) / HttpException

# Class: HttpException

[base](../modules/base.md).HttpException

## Hierarchy

- `Error`

  ↳ **`HttpException`**

  ↳↳ [`HttpServerException`](base.HttpServerException.md)

  ↳↳ [`HttpClientException`](base.HttpClientException.md)

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

• **new HttpException**(`statusCode`, `msgOrParams?`)

Construct a new HttpException class

#### Parameters

| Name           | Type                              | Description                                                                         |
| :------------- | :-------------------------------- | :---------------------------------------------------------------------------------- |
| `statusCode`   | `number`                          | http status code between 400-599, no checks are done on the validity of the number. |
| `msgOrParams?` | `string` \| `HttpExceptionParams` | either a message or an object containing HttpExceptionParams                        |

#### Overrides

Error.constructor

## Properties

### cause

• `Optional` `Readonly` **cause**: `Error` \| [`HttpException`](base.HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

**`See`**

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Overrides

Error.cause

---

### code

• `Readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'AbortError', 'CODE-1234'...)

---

### errorId

• `Readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

---

### message

• **message**: `string`

#### Inherited from

Error.message

---

### method

• `Readonly` **method**: `undefined` \| `HttpMethod`

Http method

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

• `Readonly` **statusCode**: `number`

Http error status code (400-599)

---

### url

• `Readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

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

Error.prepareStackTrace

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

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

Error.captureStackTrace
