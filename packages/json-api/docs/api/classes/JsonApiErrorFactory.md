[@httpx/json-api - v0.2.4](../README.md) / JsonApiErrorFactory

# Class: JsonApiErrorFactory

## Table of contents

### Constructors

- [constructor](JsonApiErrorFactory.md#constructor)

### Methods

- [fromCatchVariable](JsonApiErrorFactory.md#fromcatchvariable)
- [fromHttpException](JsonApiErrorFactory.md#fromhttpexception)

## Constructors

### constructor

• **new JsonApiErrorFactory**()

## Methods

### fromCatchVariable

▸ `Static` **fromCatchVariable**(`error`, `defaultHttpStatus?`): [`JsonApiError`](../README.md#jsonapierror)

#### Parameters

| Name                | Type      | Default value |
| :------------------ | :-------- | :------------ |
| `error`             | `unknown` | `undefined`   |
| `defaultHttpStatus` | `number`  | `500`         |

#### Returns

[`JsonApiError`](../README.md#jsonapierror)

---

### fromHttpException

▸ `Static` **fromHttpException**(`exception`, `defaultHttpStatus?`): [`JsonApiError`](../README.md#jsonapierror)

#### Parameters

| Name                | Type                                   | Default value | Description                                                 |
| :------------------ | :------------------------------------- | :------------ | :---------------------------------------------------------- |
| `exception`         | `string` \| `Error` \| `HttpException` | `undefined`   | -                                                           |
| `defaultHttpStatus` | `number`                               | `500`         | fallback http status if it can't be inferred from exception |

#### Returns

[`JsonApiError`](../README.md#jsonapierror)
