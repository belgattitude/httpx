[**@httpx/jwt-verify v0.1.7**](../README.md)

---

[@httpx/jwt-verify](../README.md) / JwtVerifyError

# Class: JwtVerifyError

## Extends

- `Error`

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Constructors

### Constructor

> **new JwtVerifyError**(`msg`, `options`): `JwtVerifyError`

#### Parameters

##### msg

`string`

##### options

###### cause

`Error` \| `JOSEError`

#### Returns

`JwtVerifyError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: `string`

---

### type

> `readonly` **type**: `"jwt-verify"` = `'jwt-verify'`

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
