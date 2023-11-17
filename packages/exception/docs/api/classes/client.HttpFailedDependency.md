[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpFailedDependency

# Class: HttpFailedDependency

[client](../modules/client.md).HttpFailedDependency

424 Failed dependency (client / webdav specific)

The method could not be performed on the resource because the requested action depended on another action
and that action failed.

For example, if a command in a PROPPATCH method fails, then, at minimum, the rest of the commands will
also fail with 424 Failed Dependency.

**`See`**

https://httpstatus.in/424/

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpFailedDependency`**

## Table of contents

### Constructors

- [constructor](client.HttpFailedDependency.md#constructor)

### Properties

- [cause](client.HttpFailedDependency.md#cause)
- [code](client.HttpFailedDependency.md#code)
- [errorId](client.HttpFailedDependency.md#errorid)
- [message](client.HttpFailedDependency.md#message)
- [method](client.HttpFailedDependency.md#method)
- [name](client.HttpFailedDependency.md#name)
- [stack](client.HttpFailedDependency.md#stack)
- [statusCode](client.HttpFailedDependency.md#statuscode)
- [url](client.HttpFailedDependency.md#url)
- [STATUS](client.HttpFailedDependency.md#status)
- [prepareStackTrace](client.HttpFailedDependency.md#preparestacktrace)
- [stackTraceLimit](client.HttpFailedDependency.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpFailedDependency.md#capturestacktrace)

## Constructors

### constructor

• **new HttpFailedDependency**(`msgOrParams?`): [`HttpFailedDependency`](client.HttpFailedDependency.md)

#### Parameters

| Name           | Type                                                                         |
| :------------- | :--------------------------------------------------------------------------- |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

#### Returns

[`HttpFailedDependency`](client.HttpFailedDependency.md)

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

▪ `Static` `Readonly` **STATUS**: `424`

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
