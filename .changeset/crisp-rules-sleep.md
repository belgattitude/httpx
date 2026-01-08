---
"@httpx/jwt-verify": minor
---

Add OidcDiscoveryFetcher

OIDC Discovery Fetcher can be used to safely fetch and validate OIDC configurations.

```typescript
import { OidcDiscoveryFetcher } from '@flowblade/jwt-verify';

const fetchOptions = {
    // See options below
};

const fetcher = new OidcDiscoveryFetcher(
    // Optional default fetch options for all calls
    fetchOptions
);

// Any oidc discovery url
const oidcDiscoveryUrl = 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration';

const { data, error } = await fetcher.safeFetch(oidcDiscoveryUrl,
    // optional to override fetch options for this call
    fetchOptions
);

if (data) {
    console.log('Discovery Payload:', data);
}

if (error) {
    // FetchError | InvalidOidcConfigError
    console.error('Error fetching OIDC configuration:', error);
}
```

#### FetcherOptions

By default, the fetcher uses the following options:

```typescript
const fetchOptions = {
    // These are the default options, you can customize them as needed
    // in the constructor or in safeFetch
    timeoutMs: 30_000,
    retry: {
        limit: 3,
        methods: ['get', 'head', 'options', 'trace'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
        afterStatusCodes: [413, 429, 503],
        maxRetryAfter: Number.POSITIVE_INFINITY,
        retryOnTimeout: true,
        delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1000,
    },
}
```