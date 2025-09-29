[**@httpx/jwt-verify v0.0.1**](../README.md)

***

[@httpx/jwt-verify](../README.md) / JwtVerifyError

# Class: JwtVerifyError

## Extends

- `Error`

## Implements

- `TypedError`

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

***

### type

> `readonly` **type**: `"jwt-verify"` = `'jwt-verify'`

#### Implementation of

`TypedError.type`

***

### \[hasInstance\]()

> `static` **\[hasInstance\]**: (`value`) => `boolean`

#### Parameters

##### value

`unknown`

#### Returns

`boolean`
