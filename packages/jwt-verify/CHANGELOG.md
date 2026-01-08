# @httpx/jwt-verify

## 0.2.0

### Minor Changes

- [#2661](https://github.com/belgattitude/httpx/pull/2661) [`6b7fa57`](https://github.com/belgattitude/httpx/commit/6b7fa572f8f93322521312f85c8a5d94c02756fd) Thanks [@belgattitude](https://github.com/belgattitude)! - jwt-verify is now built with tsdown rather than tsup

- [#2661](https://github.com/belgattitude/httpx/pull/2661) [`6b7fa57`](https://github.com/belgattitude/httpx/commit/6b7fa572f8f93322521312f85c8a5d94c02756fd) Thanks [@belgattitude](https://github.com/belgattitude)! - Upgrade minimal version of jose to be ^6.1.3

- [#2661](https://github.com/belgattitude/httpx/pull/2661) [`6b7fa57`](https://github.com/belgattitude/httpx/commit/6b7fa572f8f93322521312f85c8a5d94c02756fd) Thanks [@belgattitude](https://github.com/belgattitude)! - Add OidcDiscoveryFetcher

  OIDC Discovery Fetcher can be used to safely fetch and validate OIDC configurations.

  ```typescript
  import { OidcDiscoveryFetcher } from "@httpx/jwt-verify";

  const fetchOptions = {
    // See options below
  };

  const fetcher = new OidcDiscoveryFetcher(
    // Optional default fetch options for all calls
    fetchOptions
  );

  // Any oidc discovery url
  const oidcDiscoveryUrl =
    "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration";

  const { data, error } = await fetcher.safeFetch(
    oidcDiscoveryUrl,
    // optional to override fetch options for this call
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

  #### FetcherOptions

  By default, the fetcher uses the following options:

  ```typescript
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
  ```

- [#2661](https://github.com/belgattitude/httpx/pull/2661) [`6b7fa57`](https://github.com/belgattitude/httpx/commit/6b7fa572f8f93322521312f85c8a5d94c02756fd) Thanks [@belgattitude](https://github.com/belgattitude)! - Export type TypedError

- [#2661](https://github.com/belgattitude/httpx/pull/2661) [`6b7fa57`](https://github.com/belgattitude/httpx/commit/6b7fa572f8f93322521312f85c8a5d94c02756fd) Thanks [@belgattitude](https://github.com/belgattitude)! - Move standard/spec to peerDependencies

- [#2661](https://github.com/belgattitude/httpx/pull/2661) [`6b7fa57`](https://github.com/belgattitude/httpx/commit/6b7fa572f8f93322521312f85c8a5d94c02756fd) Thanks [@belgattitude](https://github.com/belgattitude)! - Updated browserslist configuration to `defaults, > 0.26%, last 2 versions, Firefox ESR, not dead`

## 0.1.7

### Patch Changes

- Updated dependencies [[`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748)]:
  - @httpx/lru@0.13.0

## 0.1.6

### Patch Changes

- [#2652](https://github.com/belgattitude/httpx/pull/2652) [`2cbe861`](https://github.com/belgattitude/httpx/commit/2cbe861ea41bd5a7b4d0542c4c891aa67570395b) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

  PS: due to a failing ci action, the correct changes can be found in [#2648](https://github.com/belgattitude/httpx/pull/2648)

- Updated dependencies [[`2cbe861`](https://github.com/belgattitude/httpx/commit/2cbe861ea41bd5a7b4d0542c4c891aa67570395b)]:
  - @httpx/lru@0.12.4

## 0.1.5

### Patch Changes

- [#2650](https://github.com/belgattitude/httpx/pull/2650) [`a30cf76`](https://github.com/belgattitude/httpx/commit/a30cf7699e9950315ebc4002a9f387929935da75) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

  PS: due a failing ci action, the correct changes can be found in [#2648](https://github.com/belgattitude/httpx/pull/2648)

- Updated dependencies [[`a30cf76`](https://github.com/belgattitude/httpx/commit/a30cf7699e9950315ebc4002a9f387929935da75)]:
  - @httpx/lru@0.12.3

## 0.1.4

### Patch Changes

- [#2648](https://github.com/belgattitude/httpx/pull/2648) [`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

- Updated dependencies [[`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee)]:
  - @httpx/lru@0.12.2

## 0.1.3

### Patch Changes

- [#2643](https://github.com/belgattitude/httpx/pull/2643) [`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c) Thanks [@belgattitude](https://github.com/belgattitude)! - Enable CI for bun latest on CI (bun 1.3.3)

- Updated dependencies [[`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c)]:
  - @httpx/lru@0.12.1

## 0.1.2

### Patch Changes

- Updated dependencies [[`6c2486e`](https://github.com/belgattitude/httpx/commit/6c2486e082cdeacee0969a359213570aef512a04)]:
  - @httpx/lru@0.12.0

## 0.1.1

### Patch Changes

- [#2578](https://github.com/belgattitude/httpx/pull/2578) [`999b4c9`](https://github.com/belgattitude/httpx/commit/999b4c9fe17b6ee15adc46226102a95a279ad033) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix issue with return types

## 0.1.0

### Minor Changes

- [#2570](https://github.com/belgattitude/httpx/pull/2570) [`7fb189d`](https://github.com/belgattitude/httpx/commit/7fb189df071320e5b53f950d4176866c3ad6eb06) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial @httpx/jwt-verify package
