[**@httpx/jwt-verify v0.1.7**](../README.md)

---

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

### safeParse()

> **safeParse**\<`TSchema`\>(`token`, `options?`): `Promise`\<`Result`\<`ParsedJwtSuccess`\<`TSchema` _extends_ `undefined` ? `JWTPayload` : `InferOutput`\<`TSchema`\> & `JWTPayload`\>, `JwtVerifyErrors`\>\>

Safely parse and verify a JWT token

#### Type Parameters

##### TSchema

`TSchema` _extends_ `StandardSchemaV1`\<`unknown`, `unknown`\>

#### Parameters

##### token

`string`

##### options?

###### schema?

`TSchema`

#### Returns

`Promise`\<`Result`\<`ParsedJwtSuccess`\<`TSchema` _extends_ `undefined` ? `JWTPayload` : `InferOutput`\<`TSchema`\> & `JWTPayload`\>, `JwtVerifyErrors`\>\>

#### Example

```typescript
import { JWTVerifier } from "@httpx/jwt-verify";
import * as v from "valibot"; // or any standard-schema compatible schema library

const entraVerifier = new JwtVerifier({
  authorityHost: "https://login.microsoftonline.com",
  tenantId: "8ca5b849-53e1-48cf-89fb-0103886af200",
  clockToleranceSec: 60, // optional
});

const token = "...";

const { data, error } = await entraVerifier.safeParse(token, {
  schema: v.object({
    oid: v.string(),
  }),
});

// If something failed the error will be !== undefined
if (error) {
  // `error` is an instance Error with a brand of TypedError
  // Currently supported are: NotATokenError, ExpiredTokenError
  // SchemaValidationError, JwtVerifyError, FetchError
}

// If everything went fine, data will be defined
console.log("Token payload:", data.payload);
```
