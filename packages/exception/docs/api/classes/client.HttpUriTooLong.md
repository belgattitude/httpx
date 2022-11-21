[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpUriTooLong

# Class: HttpUriTooLong

[client](../modules/client.md).HttpUriTooLong

414 URI too long (client)

The URI requested by the client is longer than the server is willing to interpret.

**`See`**

 - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
 - https://httpstatus.in/414/

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpUriTooLong`**

## Table of contents

### Constructors

- [constructor](client.HttpUriTooLong.md#constructor)

### Properties

- [cause](client.HttpUriTooLong.md#cause)
- [code](client.HttpUriTooLong.md#code)
- [errorId](client.HttpUriTooLong.md#errorid)
- [message](client.HttpUriTooLong.md#message)
- [method](client.HttpUriTooLong.md#method)
- [name](client.HttpUriTooLong.md#name)
- [stack](client.HttpUriTooLong.md#stack)
- [statusCode](client.HttpUriTooLong.md#statuscode)
- [url](client.HttpUriTooLong.md#url)
- [STATUS](client.HttpUriTooLong.md#status)
- [prepareStackTrace](client.HttpUriTooLong.md#preparestacktrace)
- [stackTraceLimit](client.HttpUriTooLong.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpUriTooLong.md#capturestacktrace)

## Constructors

### constructor

• **new HttpUriTooLong**(`msgOrParams?`)

#### Parameters

| Name | Type |
| :------ | :------ |
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

___

### code

• `Readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'AbortError', 'CODE-1234'...)

#### Inherited from

[HttpClientException](base.HttpClientException.md).[code](base.HttpClientException.md#code)

___

### errorId

• `Readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[HttpClientException](base.HttpClientException.md).[errorId](base.HttpClientException.md#errorid)

___

### message

• **message**: `string`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[message](base.HttpClientException.md#message)

___

### method

• `Readonly` **method**: `undefined` \| [`HttpMethod`](../modules/types.md#httpmethod)

Http method

#### Inherited from

[HttpClientException](base.HttpClientException.md).[method](base.HttpClientException.md#method)

___

### name

• **name**: `string`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[name](base.HttpClientException.md#name)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[stack](base.HttpClientException.md#stack)

___

### statusCode

• `Readonly` **statusCode**: `number`

Http error status code (400-599)

#### Inherited from

[HttpClientException](base.HttpClientException.md).[statusCode](base.HttpClientException.md#statuscode)

___

### url

• `Readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[HttpClientException](base.HttpClientException.md).[url](base.HttpClientException.md#url)

___

### STATUS

▪ `Static` `Readonly` **STATUS**: ``414``

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[prepareStackTrace](base.HttpClientException.md#preparestacktrace)

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[stackTraceLimit](base.HttpClientException.md#stacktracelimit)

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[HttpClientException](base.HttpClientException.md).[captureStackTrace](base.HttpClientException.md#capturestacktrace)
