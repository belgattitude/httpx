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

• **new SerializerError**(`message`, `params?`): [`SerializerError`](serializer.SerializerError.md)

#### Parameters

| Name            | Type     |
| :-------------- | :------- |
| `message`       | `string` |
| `params?`       | `Object` |
| `params.cause?` | `Error`  |

#### Returns

[`SerializerError`](serializer.SerializerError.md)

#### Overrides

Error.constructor

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

---

### message

• **message**: `string`

#### Inherited from

Error.message

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
