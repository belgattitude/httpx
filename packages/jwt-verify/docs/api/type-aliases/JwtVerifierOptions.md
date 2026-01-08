[**@httpx/jwt-verify v0.1.7**](../README.md)

---

[@httpx/jwt-verify](../README.md) / JwtVerifierOptions

# Type Alias: JwtVerifierOptions

> **JwtVerifierOptions** = `object`

## Properties

### audience?

> `optional` **audience**: `string` \| `string`[]

The expected audience(s) to validate against the token's `aud` claim.

Accepts either a single string (for example a client_id, scope or resource URI)
or an array of strings when the token may be valid for multiple audiences.
When provided, the verifier requires the token's `aud` claim to match at least
one of these values. If omitted, audience validation is not performed.

#### Examples

```ts
// single audience
audience = "api://1234";
```

```ts
// multiple audiences
audience = ["api://1234", "https://api.example.com"];
```

#### See

https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3

---

### authorityHost

> **authorityHost**: `string`

The base authority host URL used to locate the OIDC discovery document and for issuer resolution.

Must be an absolute URL including the scheme (for example `https://login.microsoftonline.com`).
Do not include a trailing slash or additional path segments — the verifier appends the
`tenantId` and discovery path (for example:
`{authorityHost}/{tenantId}/v2.0/.well-known/openid-configuration`).

Use a secure `https` endpoint in production. Can point to a custom identity provider or a
local endpoint for testing; when using non‑standard ports include them in the URL.

#### Examples

```ts
// Azure public cloud
authorityHost = "https://login.microsoftonline.com";
```

```ts
// custom identity provider
authorityHost = "https://auth.example.com";
```

```ts
// local testing (include scheme and port)
authorityHost = "http://localhost:8080";
```

#### See

https://openid.net/specs/openid-connect-discovery-1_0.html

---

### clockToleranceSec?

> `optional` **clockToleranceSec**: `number`

Allowed clock skew in seconds when validating time-based claims (`exp`, `nbf`, `iat`).

This value is forwarded to the underlying JWT verifier as `clockTolerance`.
Use a small positive number to tolerate minor clock differences between the
token issuer and verifier. Value is in seconds. Increasing this value relaxes
expiry/nbf checks — avoid large values in security-sensitive contexts.

#### Examples

```ts
// default one minute tolerance
clockToleranceSec = 60;
```

```ts
// allow five seconds of skew
clockToleranceSec = 5;
```

#### Default

```ts
60;
```

---

### expectedIssuer?

> `optional` **expectedIssuer**: `string`

Override issuer used to validate the token's `iss` claim.

When provided, this value is used instead of the issuer obtained from the OIDC
discovery document. Use this to validate tokens when the discovery issuer does
not match the token's `iss` claim (for example in testing, proxies, or custom
deployments). Must be the full issuer URL expected in the token's `iss` claim
(including scheme and host). Avoid trailing slashes.

#### Examples

```ts
// Azure single-tenant issuer
expectedIssuer =
  "https://login.microsoftonline.com/8ca5b849-53e1-48cf-89fb-0103886af200/v2.0";
```

```ts
// Custom identity provider
expectedIssuer = "https://auth.example.com";
```

#### See

https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1

---

### oidcConfigFetchOptions?

> `optional` **oidcConfigFetchOptions**: [`OidcDiscoveryOptions`](OidcDiscoveryOptions.md)

Optionally pass options to configure the OIDC configuration fetcher.

By default the fetcher uses a 30 seconds timeout and retries up to 3 times

```typescript
const defaultFetchOptions = {
  timeoutMs: 30_000,
  retry: {
    limit: 3,
    methods: ["get", "head", "options", "trace"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    afterStatusCodes: [413, 429, 503],
    maxRetryAfter: Number.POSITIVE_INFINITY,
    retryOnTimeout: true,
    delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1000,
  },
} as const satisfies OidcConfigFetchOptions;
```

---

### schema?

> `optional` **schema**: `StandardSchemaV1`\<`unknown`\>

Optional standard-schema compatible vaildation schema used to validate
the decoded JWT payload. Most li

When provided on the verifier instance it acts as the default for all `safeParse` calls.
Each `safeParse` call may also pass a `schema` to override the verifier default.

#### See

https://standardschema.dev/schema#what-schema-libraries-implement-the-spec

---

### tenantId

> **tenantId**: `string`

The tenant identifier used to build the OIDC authority URL.

Accepts a GUID tenant id (for a single-tenant app) or one of the Azure shortcuts:
`common`, `organizations`, or `consumers`.

This value is appended to `authorityHost` as the path segment used to locate
the OpenID Connect discovery document (for example:
`{authorityHost}/{tenantId}/v2.0/.well-known/openid-configuration`).
Do not include leading or trailing slashes.

#### Examples

```ts
// single-tenant (GUID)
tenantId = "8ca5b849-53e1-48cf-89fb-0103886af200";
```

```ts
// multi-tenant or common endpoints
tenantId = "common";
```
