[**@httpx/jwt-verify v0.1.7**](../README.md)

---

[@httpx/jwt-verify](../README.md) / ExpiredTokenError

# Class: ExpiredTokenError

## Extends

- `Error`

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Constructors

### Constructor

> **new ExpiredTokenError**(`message?`): `ExpiredTokenError`

#### Parameters

##### message?

`string`

#### Returns

`ExpiredTokenError`

#### Inherited from

`Error.constructor`

### Constructor

> **new ExpiredTokenError**(`message?`, `options?`): `ExpiredTokenError`

#### Parameters

##### message?

`string`

##### options?

`ErrorOptions`

#### Returns

`ExpiredTokenError`

#### Inherited from

`Error.constructor`

## Properties

### type

> `readonly` **type**: `"expired-token"` = `'expired-token'`

#### Implementation of

[`TypedError`](../interfaces/TypedError.md).[`type`](../interfaces/TypedError.md#type)

---

### \[hasInstance\]()

> `static` **\[hasInstance\]**: (`value`) => `boolean`

#### Parameters

##### value

`unknown`

#### Returns

`boolean`
