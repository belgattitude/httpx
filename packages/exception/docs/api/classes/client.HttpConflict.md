[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpConflict

# Class: HttpConflict

[client](../modules/client.md).HttpConflict

409 Conflict (client)

This response is sent when a request conflicts with the current state of the server.

**`See`**

 - https://httpstatus.in/409/
 - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpConflict`**

## Table of contents

### Constructors

- [constructor](client.HttpConflict.md#constructor)

### Properties

- [cause](client.HttpConflict.md#cause)
- [code](client.HttpConflict.md#code)
- [errorId](client.HttpConflict.md#errorid)
- [message](client.HttpConflict.md#message)
- [method](client.HttpConflict.md#method)
- [name](client.HttpConflict.md#name)
- [stack](client.HttpConflict.md#stack)
- [statusCode](client.HttpConflict.md#statuscode)
- [url](client.HttpConflict.md#url)
- [STATUS](client.HttpConflict.md#status)
- [prepareStackTrace](client.HttpConflict.md#preparestacktrace)
- [stackTraceLimit](client.HttpConflict.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpConflict.md#capturestacktrace)

## Constructors

### constructor

• **new HttpConflict**(`msgOrParams?`)

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

▪ `Static` `Readonly` **STATUS**: ``409``

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
