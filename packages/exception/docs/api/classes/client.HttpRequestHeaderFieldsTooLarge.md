[@httpx/exception](../README.md) / [client](../modules/client.md) / HttpRequestHeaderFieldsTooLarge

# Class: HttpRequestHeaderFieldsTooLarge

[client](../modules/client.md).HttpRequestHeaderFieldsTooLarge

431 Request Header Fields Too Large (client)

The server is unwilling to process the request because its header fields are too large.
The request may be resubmitted after reducing the size of the request header fields.

**`See`**

 - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431
 - https://httpstatus.in/431/

## Hierarchy

- [`HttpClientException`](base.HttpClientException.md)

  ↳ **`HttpRequestHeaderFieldsTooLarge`**

## Table of contents

### Constructors

- [constructor](client.HttpRequestHeaderFieldsTooLarge.md#constructor)

### Properties

- [cause](client.HttpRequestHeaderFieldsTooLarge.md#cause)
- [code](client.HttpRequestHeaderFieldsTooLarge.md#code)
- [errorId](client.HttpRequestHeaderFieldsTooLarge.md#errorid)
- [message](client.HttpRequestHeaderFieldsTooLarge.md#message)
- [method](client.HttpRequestHeaderFieldsTooLarge.md#method)
- [name](client.HttpRequestHeaderFieldsTooLarge.md#name)
- [stack](client.HttpRequestHeaderFieldsTooLarge.md#stack)
- [statusCode](client.HttpRequestHeaderFieldsTooLarge.md#statuscode)
- [url](client.HttpRequestHeaderFieldsTooLarge.md#url)
- [STATUS](client.HttpRequestHeaderFieldsTooLarge.md#status)
- [prepareStackTrace](client.HttpRequestHeaderFieldsTooLarge.md#preparestacktrace)
- [stackTraceLimit](client.HttpRequestHeaderFieldsTooLarge.md#stacktracelimit)

### Methods

- [captureStackTrace](client.HttpRequestHeaderFieldsTooLarge.md#capturestacktrace)

## Constructors

### constructor

• **new HttpRequestHeaderFieldsTooLarge**(`msgOrParams?`)

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

▪ `Static` `Readonly` **STATUS**: ``431``

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
