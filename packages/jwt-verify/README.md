# @httpx/jwt-verify

[![npm](https://img.shields.io/npm/v/@httpx/jwt-verify?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/jwt-verify)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/jwt-verify/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-jwt-verify-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fjwt-verify)
[![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/jwt-verify/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/jwt-verify?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/jwt-verify)
[![license](https://img.shields.io/npm/l/@httpx/jwt-verify?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/jwt-verify
$ yarn add @httpx/jwt-verify
$ pnpm add @httpx/jwt-verify
```

> Optionally: add `@standard-schema/spec` and the validation of your choice (zod, valibot...)

## Features

- ✨&nbsp; Customize payload validation with any [standard-schema](https://github.com/standard-schema/standard-schema) compatible library (ie: zod, valibot...).
- 🛡️&nbsp; Rely on battle tested [jose](https://github.com/panva/jose) for jwt validation and decoding.
- ✨️&nbsp; OIDC Discovery Fetcher to safely fetch and validate OIDC configurations (retries...).
- 🧪&nbsp; Tested on [node 20-25, bun, browser, cloudflare workers and runtime/edge](#compatibility).

## Documentation

### OIDC Verifier

```typescript
import { JwtVerifier } from "@httpx/jwt-verify";
import * as v from "valibot";

const entraVerifier = new JwtVerifier({
  authorityHost: "https://login.microsoftonline.com",
  tenantId: "xxxxxx-xxx-xxxx-xxx-xxxxxxxx",
  clockToleranceSec: 60, // optional
});

const entraJwtToken = "..."; // The JWT token to verify

// Verify, validate and return the parsed token
const { value, error } = await entraVerifier.safeParse(entraJwtToken, {
  /**
   * Optional standard schema to validate the payload
   * If provided, only the properties defined in the schema will be
   * exposed in the `value.payload` object.
   */
  schema: v.object({
    // Add properties to validate, note that if you provide a schema, only
    // the properties defined in the schema will be available in the value.payload.
    oid: v.string(),
  }),
});

if (error) {
  // See error documentation for details about possible errors:
  // > NotATokenError, ExpiredTokenError, FetchError, SchemaValidationError, JwtVerifyError
  // > InvalidOidcConfigError
}

console.log("payload", value.payload);
```

### OIDC Fetcher

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

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/jwt-verify/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/jwt-verify/.size-limit.ts)

| Scenario (esm)                                            | Size (compressed) |
| --------------------------------------------------------- | ----------------: |
| `import { JwtVerifier } from '@httpx/jwt-verify`          |         ~ 12.30KB |
| `import { OidcDiscoveryFetcher } from '@httpx/jwt-verify` |          ~ 5.20KB |

The total size accounts for the dependency on [jose](https://github.com/panva/jose).

## Compatibility

| Level        | CI  | Description                                                                                                                                      |
| ------------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                  |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                    |
| Browserslist | ✅  | [defaults, > 0.26%, last 2 versions, Firefox ESR, not dead](https://github.com/belgattitude/httpx/blob/main/packages/jwt-verify/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                 |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                               |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                    |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                     |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                             |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together!
[Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>),
or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
   </tr>
</table>

## License

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.
