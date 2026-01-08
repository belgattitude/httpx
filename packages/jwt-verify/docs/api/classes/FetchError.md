[**@httpx/jwt-verify v0.1.7**](../README.md)

---

[@httpx/jwt-verify](../README.md) / FetchError

# Class: FetchError

## Extends

- `TypeError`

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Constructors

### Constructor

> **new FetchError**(`params`, `options`): `FetchError`

#### Parameters

##### params

###### message

`string`

###### statusCode?

`number`

Http status code that is related to the FetchError if available

###### statusText?

`string`

Http status code that is related to the FetchError if available

###### url

`string`

Url that was being fetched when the error occurred

##### options

###### cause?

`Error` \| `HTTPError`\<`unknown`\>

#### Returns

`FetchError`

#### Overrides

`TypeError.constructor`

## Properties

### statusCode

> `readonly` **statusCode**: `number` \| `undefined`

Http status code that is related to the FetchError if available

---

### statusText

> `readonly` **statusText**: `string` \| `undefined`

Http statusText that is related to the FetchError if available

---

### type

> `readonly` **type**: `"fetch-error"` = `'fetch-error'`

#### Implementation of

[`TypedError`](../interfaces/TypedError.md).[`type`](../interfaces/TypedError.md#type)

---

### url

> `readonly` **url**: `string` \| `undefined`

Url that was being fetched when the error occurred

---

### \[hasInstance\]()

> `static` **\[hasInstance\]**: (`value`) => `boolean`

#### Parameters

##### value

`unknown`

#### Returns

`boolean`
