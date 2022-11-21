[@httpx/exception](../README.md) / [serializer](../modules/serializer.md) / SerializerError

# Class: SerializerError

[serializer](../modules/serializer.md).SerializerError

## Hierarchy

- `Error`

  ↳ **`SerializerError`**

## Table of contents

### Constructors

- [constructor](serializer.SerializerError.md#constructor)

### Properties

- [cause](serializer.SerializerError.md#cause)
- [message](serializer.SerializerError.md#message)
- [name](serializer.SerializerError.md#name)
- [stack](serializer.SerializerError.md#stack)
- [prepareStackTrace](serializer.SerializerError.md#preparestacktrace)
- [stackTraceLimit](serializer.SerializerError.md#stacktracelimit)

### Methods

- [captureStackTrace](serializer.SerializerError.md#capturestacktrace)

## Constructors

### constructor

• **new SerializerError**(`message`, `params?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `params?` | `Object` |
| `params.cause?` | `Error` |

#### Overrides

Error.constructor

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

___

### message

• **message**: `string`

#### Inherited from

Error.message

___

### name

• **name**: `string`

#### Inherited from

Error.name

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

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

Error.prepareStackTrace

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

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

Error.captureStackTrace
