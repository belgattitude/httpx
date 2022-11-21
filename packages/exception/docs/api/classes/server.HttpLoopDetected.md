[@httpx/exception](../README.md) / [server](../modules/server.md) / HttpLoopDetected

# Class: HttpLoopDetected

[server](../modules/server.md).HttpLoopDetected

508 Loop Detected (server / webdav specific)

The server detected an infinite loop while processing the request.

**`See`**

 - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
 - https://httpstatus.in/508/

## Hierarchy

- [`HttpServerException`](base.HttpServerException.md)

  ↳ **`HttpLoopDetected`**

## Table of contents

### Constructors

- [constructor](server.HttpLoopDetected.md#constructor)

### Properties

- [cause](server.HttpLoopDetected.md#cause)
- [code](server.HttpLoopDetected.md#code)
- [errorId](server.HttpLoopDetected.md#errorid)
- [message](server.HttpLoopDetected.md#message)
- [method](server.HttpLoopDetected.md#method)
- [name](server.HttpLoopDetected.md#name)
- [stack](server.HttpLoopDetected.md#stack)
- [statusCode](server.HttpLoopDetected.md#statuscode)
- [url](server.HttpLoopDetected.md#url)
- [STATUS](server.HttpLoopDetected.md#status)
- [prepareStackTrace](server.HttpLoopDetected.md#preparestacktrace)
- [stackTraceLimit](server.HttpLoopDetected.md#stacktracelimit)

### Methods

- [captureStackTrace](server.HttpLoopDetected.md#capturestacktrace)

## Constructors

### constructor

• **new HttpLoopDetected**(`msgOrParams?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgOrParams?` | `string` \| [`HttpExceptionParams`](../modules/types.md#httpexceptionparams) |

#### Overrides

[HttpServerException](base.HttpServerException.md).[constructor](base.HttpServerException.md#constructor)

## Properties

### cause

• `Optional` `Readonly` **cause**: `Error` \| [`HttpException`](base.HttpException.md)

If set and the runtime (browser or node) supports it
you can get back the error cause

**`See`**

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

#### Inherited from

[HttpServerException](base.HttpServerException.md).[cause](base.HttpServerException.md#cause)

___

### code

• `Readonly` **code**: `undefined` \| `string`

Custom additional code (ie: 'AbortError', 'CODE-1234'...)

#### Inherited from

[HttpServerException](base.HttpServerException.md).[code](base.HttpServerException.md#code)

___

### errorId

• `Readonly` **errorId**: `undefined` \| `string`

Inform about an unique error identifier (ie: nanoid, cuid...)

#### Inherited from

[HttpServerException](base.HttpServerException.md).[errorId](base.HttpServerException.md#errorid)

___

### message

• **message**: `string`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[message](base.HttpServerException.md#message)

___

### method

• `Readonly` **method**: `undefined` \| [`HttpMethod`](../modules/types.md#httpmethod)

Http method

#### Inherited from

[HttpServerException](base.HttpServerException.md).[method](base.HttpServerException.md#method)

___

### name

• **name**: `string`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[name](base.HttpServerException.md#name)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[stack](base.HttpServerException.md#stack)

___

### statusCode

• `Readonly` **statusCode**: `number`

Http error status code (400-599)

#### Inherited from

[HttpServerException](base.HttpServerException.md).[statusCode](base.HttpServerException.md#statuscode)

___

### url

• `Readonly` **url**: `undefined` \| `string`

Indicates the original url that caused the error.

#### Inherited from

[HttpServerException](base.HttpServerException.md).[url](base.HttpServerException.md#url)

___

### STATUS

▪ `Static` `Readonly` **STATUS**: ``508``

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

[HttpServerException](base.HttpServerException.md).[prepareStackTrace](base.HttpServerException.md#preparestacktrace)

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[HttpServerException](base.HttpServerException.md).[stackTraceLimit](base.HttpServerException.md#stacktracelimit)

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

[HttpServerException](base.HttpServerException.md).[captureStackTrace](base.HttpServerException.md#capturestacktrace)
