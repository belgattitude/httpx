[**@httpx/jwt-verify v0.1.7**](../README.md)

---

[@httpx/jwt-verify](../README.md) / OidcDiscoveryFetcher

# Class: OidcDiscoveryFetcher

## Constructors

### Constructor

> **new OidcDiscoveryFetcher**(`options?`): `OidcDiscoveryFetcher`

#### Parameters

##### options?

[`FetchOptions`](../type-aliases/FetchOptions.md)

#### Returns

`OidcDiscoveryFetcher`

## Methods

### safeFetch()

> **safeFetch**(`wellKnownUrl`, `options?`): `Promise`\<`Result`\<`DiscoveryPayload`, [`FetchError`](FetchError.md) \| [`InvalidOidcConfigError`](InvalidOidcConfigError.md)\>\>

Fetches and validates the OIDC Discovery Payload from the given URL.

#### Parameters

##### wellKnownUrl

`string`

##### options?

[`FetchOptions`](../type-aliases/FetchOptions.md)

#### Returns

`Promise`\<`Result`\<`DiscoveryPayload`, [`FetchError`](FetchError.md) \| [`InvalidOidcConfigError`](InvalidOidcConfigError.md)\>\>

#### Example

```typescript
import { OidcDiscoveryFetcher } from "@httpx/jwt-verify";

const fetchOptions = {
  // These are the default options, you can customize them as needed
  // in the constructor or in safeFetch
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
};

const fetcher = new OidcDiscoveryFetcher(fetchOptions);

// Any oidc discovery url
const oidcDiscoveryUrl =
  "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration";

const { data, error } = await fetcher.safeFetch(
  oidcDiscoveryUrl,
  // optional
  fetchOptions
);

if (data) {
  console.log("Discovery Payload:", data);
}

if (error) {
  // FetchError | InvalidOidcConfigError
  console.error("Error fetching OIDC configuration:", error);
}
```
