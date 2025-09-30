[**@httpx/jwt-verify v0.1.0**](../README.md)

***

[@httpx/jwt-verify](../README.md) / JwtVerifier

# Class: JwtVerifier

## Constructors

### Constructor

> **new JwtVerifier**(`options`): `JwtVerifier`

#### Parameters

##### options

[`JwtVerifierOptions`](../type-aliases/JwtVerifierOptions.md)

#### Returns

`JwtVerifier`

## Methods

### fetchOidcConfig()

> **fetchOidcConfig**(): `Promise`\<\{ `issuer`: `string`; `jwks_uri`: `string`; \}\>

#### Returns

`Promise`\<\{ `issuer`: `string`; `jwks_uri`: `string`; \}\>

***

### safeParse()

> **safeParse**\<`TSchema`\>(`token`, `options?`): `Promise`\<`Result`\<`ParsedJwtSuccess`\<`TSchema` *extends* `undefined` ? `JWTPayload` : `InferOutput`\<`TSchema`\> & `JWTPayload`\>, `ParseErrors`\>\>

Safely parse and verify a JWT token

#### Type Parameters

##### TSchema

`TSchema` *extends* `StandardSchemaV1`\<`unknown`, `unknown`\>

#### Parameters

##### token

`string`

##### options?

###### schema?

`TSchema`

#### Returns

`Promise`\<`Result`\<`ParsedJwtSuccess`\<`TSchema` *extends* `undefined` ? `JWTPayload` : `InferOutput`\<`TSchema`\> & `JWTPayload`\>, `ParseErrors`\>\>

#### Example

```typescript
import { JWTVerifier } from '@httpx/jwt-verify';
import * as v from 'valibot'; // or any standard-schema compatible schema library

const entraVerifier = new JwtVerifier({
  authorityHost: 'https://login.microsoftonline.com',
  tenantId: '8ca5b849-53e1-48cf-89fb-0103886af200',
  clockToleranceSec: 60, // optional
});

const token = '...';

const { error, data } = await entraVerifier.safeParse(token, {
   schema: v.object({
     oid: v.string(),
   })
});

if (error) {
  // handle error amongst
  // - NotATokenError
  // - ExpiredTokenError
  // - FetchError
  // - SchemaValidationError
  // - JwtVerifyError
}
```
