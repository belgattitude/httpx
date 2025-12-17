[**@httpx/json-api v0.6.7**](../README.md)

---

[@httpx/json-api](../README.md) / JsonApiErrorFactory

# Class: JsonApiErrorFactory

## Constructors

### Constructor

> **new JsonApiErrorFactory**(): `JsonApiErrorFactory`

#### Returns

`JsonApiErrorFactory`

## Methods

### fromCatchVariable()

> `readonly` `static` **fromCatchVariable**(`error`, `defaultHttpStatus`): [`JsonApiError`](../type-aliases/JsonApiError.md)

#### Parameters

##### error

`unknown`

##### defaultHttpStatus

`number` = `500`

#### Returns

[`JsonApiError`](../type-aliases/JsonApiError.md)

---

### fromHttpException()

> `readonly` `static` **fromHttpException**(`exception`, `defaultHttpStatus`): [`JsonApiError`](../type-aliases/JsonApiError.md)

#### Parameters

##### exception

`string` | `Error` | `HttpException`

##### defaultHttpStatus

`number` = `500`

fallback http status if it can't be inferred from exception

#### Returns

[`JsonApiError`](../type-aliases/JsonApiError.md)
