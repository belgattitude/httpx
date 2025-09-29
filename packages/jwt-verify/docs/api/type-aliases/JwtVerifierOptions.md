[**@httpx/jwt-verify v0.0.1**](../README.md)

***

[@httpx/jwt-verify](../README.md) / JwtVerifierOptions

# Type Alias: JwtVerifierOptions

> **JwtVerifierOptions** = `object`

## Properties

### audience?

> `optional` **audience**: `string` \| `string`[]

***

### authorityHost

> **authorityHost**: `string`

The authority host URL, e.g. https://login.microsoftonline.com for azure

***

### clockToleranceSec?

> `optional` **clockToleranceSec**: `number`

***

### expectedIssuer?

> `optional` **expectedIssuer**: `string`

***

### schema?

> `optional` **schema**: `StandardSchemaV1`\<`unknown`\>

***

### tenantId

> **tenantId**: `string`

The tenant ID to use in the authority URL, e.g. 'common', 'shared' or a specific tenant ID
