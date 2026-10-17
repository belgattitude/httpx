# @httpx/exception

HTTP status errors with default message, instanceof, stack and nested error support. Lightweight, typical usage between [600b and 1700b](#bundle-size). Includes convenience typeguards, optional contextual info and a built-in serializer to cover cross-environments challenges (RSC, SSR...).

[![npm](https://img.shields.io/npm/v/@httpx/exception?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/exception) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/exception/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-exception-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fexception) [![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/exception/.size-limit.cjs) [![node](https://img.shields.io/static/v1?label=Node&message=22.14%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E93%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](https://browserslist.dev/?q=ZGVmYXVsdHMsY2hyb21lID49IDk2LGZpcmVmb3ggPj0gOTAsZWRnZSA%2BPSA5MSxzYWZhcmkgPj0gMTUsaW9zID49IDE1LG9wZXJhID49IDc3) [![size](https://img.shields.io/bundlephobia/minzip/@httpx/exception@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/exception@latest) [![downloads](https://img.shields.io/npm/dm/@httpx/exception?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/exception)

## Highlights

- 👉&nbsp; Usage by [explicit named imports](#by-named-imports) and/or [status code](#by-status-code).
- 👉&nbsp; If message not provided, defaults to [http error message](#default-messages)
- 👉&nbsp; Supports pre-defined [contextual](#error-context) information.
- 👉&nbsp; Built-in [serializer](#serializer) to allow cross-env uses (ssr, rsc, superjson, logs...).
- 👉&nbsp; Supports [nested error](#nested-errors) through native [Error.cause](https://belgattitude.github.io/httpx/#/?id=about-errorcause) support.
- 👉&nbsp; Reliable [instanceof](#instanceof-checks), even [across multiple copies](#multiple-copies) of the package.
- 👉&nbsp; [Extends](#class-diagram) native Error class with [stacktrace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack) support.
- 👉&nbsp; No deps. [Node, bun, edge and modern browsers compatibility](#compatibility),

## Install

```bash
npm install @httpx/exception  # via npm
yarn add @httpx/exception     # via yarn
pnpm add @httpx/exception     # via pnpm
```

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/exception), [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/exception#readme) or [generated typedoc](https://github.com/belgattitude/httpx/tree/main/packages/exception/docs/api).

---

- [Usage](#usage)
  - [By named imports](#by-named-imports)
  - [By status code](#by-status-code)
- [Parameters](#parameters)
  - [Error context](#error-context)
- [Properties](#properties)
- [Nested errors](#nested-errors)
- [Static members](#static-members)
- [Instanceof checks](#instanceof-checks)
  - [Class diagram](#class-diagram)
  - [Multiple copies](#multiple-copies)
- [Typeguards](#typeguards)
  - [Instanceof alternatives](#instanceof-alternatives)
  - [isHttpErrorStatusCode](#ishttperrorstatuscode)
- [Serializer](#serializer)
  - [JSON](#json)
  - [Serializable](#serializable)
- [Default messages](#default-messages)
  - [Non-official status codes](#non-official-status-codes)
- [Helpers](#helpers)
  - [isErrorWithErrorStatusCode](#iserrorwitherrorstatuscode)
  - [isObjectWithErrorStatusCode](#isobjectwitherrorstatuscode)
- [About bundle](#about-bundle)
  - [Compatibility](#compatibility)
  - [Bundle size](#bundle-size)
  - [Packaging](#packaging)
  - [Typescript](#typescript)
- [Upgrade](#upgrade)
- [Support](#support)

---

## Usage

### By named imports

Explicit named imports are prefixed by `Http` to ease IDE experience. Message is optional and default to the [default message](#default-messages). Additional [parameters](#parameters) are supported.

```typescript
import { HttpNotFound, HttpBadRequest } from "@httpx/exception";

const e = new HttpNotFound();
// 👉 e.message     -> 'Not found' (default message)
// 👉 e.statusCode  -> 404
// 👉 -> e instanceof HttpNotFound (and HttpClientException, HttpException and Error)

const e400 = new HttpBadRequest("Problems parsing JSON");
// 👉 e.message     -> 'Problems parsing JSON'
// ...
```

### By status code

The `createHttpException` function allows to create an exception from an arbitrary status code.

```typescript
import { createHttpException } from "@httpx/exception";

const e404 = createHttpException(404); // e404 instanceof HttpClientException
const e500 = createHttpException(500); // e500 instanceof HttpServerException
```

Additional [parameters](#httpexception-parameters) can be provided as a second argument.

```typescript
import { createHttpException, HttpNotImplemented } from "@httpx/exception";

throw createHttpException(404, "The graal is yet to find !");

const e500 = createHttpException(500, {
  message: "Something really wrong happened.",
  url: "https://api.dev/gateway",
  cause: new HttpNotImplemented(), // or any Error...
});
```

## Parameters

Http exceptions and `createHttpException` accept a parameter of type `string | HttpExceptionParams`. If no parameter is provided the [default message](#default-messages) is used.

### Error context

It's possible to attach informational context to an exception. This is particularly useful when used with centralized logging / error reporting.

| HttpExceptionParams | Type | Description |
| --- | --- | --- |
| statusCode | `number` | Http error status code (400-599). |
| message | `string` | Default or provided message. |
| url | `string?` | Origin url.. |
| method | `HttpMethod?` | Origin http method. |
| code | `string?` | Custom error code (not to be confused with statusCode). |
| errorId | `string?` | Unique custom error id. |
| stack | `string?` | @see [Error.prototype.stack](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack) on MDN. |
| cause | `Error?` | @see [about error cause](#about-errorcause) |
| issues | `HttpValidationIssues[]?` | Only supported by HttpUnprocessableEntity (422) |

Example:

```typescript
import { HttpGatewayTimeout, HttpInternalServerError } from "@httpx/exception";

const e500 = new HttpInternalServerError({
  url: "https://api.dev/gateway",
  method: "GET",
  code: "ERR_UNREACHABLE_SERVICE",
  errorId: nanoid(),
  // 👉 nesting
  cause: new HttpGatewayTimeout({
    message: "This Serverless Function has timed out",
    errorId: "cdg1::h99k2-1664884491087-b41a2832f559",
  }),
});
```

## Properties

All parameters are exposed as properties.

| HttpException | Type | Description |
| --- | --- | --- |
| statusCode | `number` | Http error status code (400-599). |
| message | `string` | Default or provided message. |
| url | `string?` | Origin url.. |
| method | `HttpMethod?` | Origin http method. |
| code | `string?` | Custom error code (not to be confused with statusCode). |
| errorId | `string?` | Unique custom error id. |
| stack | `string?` | @see [Error.prototype.stack](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack) on MDN. |
| cause | `Error?` | @see [about nested errors](#nested-errors) |
| issues | `ValidationIssues[]?` | Only supported by HttpUnprocessableEntity (422) |

```typescript
import { HttpUnprocessableEntity } from "@httpx/exception";

const e422 = new HttpUnprocessableEntity({
  message: "Request validation failed",
  url: "https://acme.org/api/user/create",
  method: "POST",
  issues: [
    // typed as ValidationIssues[]
    {
      message: "Invalid address",
      path: ["addresses", 0, "line1"],
      code: "empty_string",
    },
  ],
});

// 👉 e422.issues
// 👉 e422.method === 'POST'
// ...
```

## Nested errors

When creating a http exception, it's possible to attach the original error to the native [Error.cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) property.

```typescript
const e = new HttpBadRequest({
  // 👉 nesting
  cause: new TypeError({
    message: "Param validation failed",
    // 👉 nesting: multiple levels are supported
    cause: new NoSuchUser("User id is invalid"),
  }),
});
```

> Error cause is supported by [>93% of browsers](https://caniuse.com/mdn-javascript_builtins_error_cause) as of 12/2023. NodeJs supports it since 16.17. Nested cause will simply be discarded if not supported (no runtime error). The [error-cause-polyfill](https://github.com/ehmicky/error-cause-polyfill) can be installed if not provided already by your framework.

## Static members

All exceptions have a static `STATUS` readonly property.

```typescript
import { createHttpException, HttpMethodNotAllowed } from "@httpx/exception";

const { statusCode } = createHttpException(405);
switch (statusCode) {
  case HttpMethodNotAllowed.STATUS:
    console.log(statusCode); // 👉 405
    break;
}
```

## Instanceof checks

Http exceptions extends the native [Error class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) through HttpException and either HttpServerException and HttpClientException.

```typescript
import { createHttpException } from "@httpx/exception";

const e404 = createHttpException(404);
// 👉 e instanceof Error === true
// 👉 e instanceof HttpException === true
// 👉 e instanceof HttpClientException === true
// 👉 e instanceof HttpNotFound === true
// 👉 e instanceof HttpServerException === false
```

### Class diagram

```mermaid
classDiagram
    Error <|-- HttpException
    Error: +string message
    Error: +string? stack
    Error: +unknown cause
    HttpException : +int statusCode
    HttpException : +String url
    HttpException : +Error? cause
    HttpException <|-- HttpClientException
    HttpException <|-- HttpServerException
    HttpClientException <|-- HttpNotFound
    HttpServerException <|-- HttpInternalServerError
    HttpNotFound : 404 statusCode
    HttpInternalServerError: 500 statusCode
```

### Multiple copies

An app can end up with multiple copies of `@httpx/exception`: the ESM and CJS builds loaded side by side (ie: one dependency `import` it, another `require` it) or duplicated installs in `node_modules`. Each copy has its own classes, so a plain `instanceof` would fail and an `HttpNotFound` thrown by a dependency could end up handled as a generic error (500).

To prevent this, exceptions are branded with a global symbol scoped to the major version (ie: `Symbol.for("@httpx/exception-v3")`) and `instanceof` (thus the [typeguards](#typeguards) and the [serializer](#serializer)) also recognizes instances created by another copy of the same major version.

```typescript
import { HttpNotFound, isHttpException } from "@httpx/exception";
// ie: a dependency using a cjs build or a duplicated install
const { HttpNotFound: OtherHttpNotFound } = require("@httpx/exception");

const e = new OtherHttpNotFound();
// 👉 e instanceof HttpNotFound === true
// 👉 isHttpException(e) === true
```

> **Note** Exceptions from a different major version are not recognized (their shape may differ). In that case, dedupe the package (ie: `pnpm dedupe`) or rely on duck-typing helpers such as [isErrorWithErrorStatusCode](#iserrorwitherrorstatuscode). Exceptions created in another realm (ie: iframe, `node:vm` context) from the same copy also pass `instanceof`, but a nested `cause` from another realm is discarded.

## Typeguards

### Instanceof alternatives

While the usage of `instanceof` is preferred, the `isHttpException`, `isHttpClientException` and `isServerException` can be used in place. They will check for instance and will also ensure that the associated `statusCode` is actually valid.

```typescript
import {
  isHttpException,
  isHttpClientException,
  isHttpServerException,
} from "@httpx/exception";

// True
isHttpException(new HttpNotFound());
isHttpClientException(new HttpNotFound());
isHttpServerException(new HttpInternalServerError());

// False
isHttpClientException(new HttpInternalServerError());
isHttpServerException(new HttpNotFound());
isHttpException(new Error());
isHttpServerException(
  new (class extends HttpServerException {
    constructor() {
      super(400); // 400 isn't a server exception
    }
  })()
);
```

### isHttpErrorStatusCode

```typescript
import { isHttpErrorStatusCode } from "@httpx/exception";

// True
isHttpErrorStatusCode(404);
// False
isHttpErrorStatusCode(200);
```

## Serializer

Exceptions can be (de-)serialized to json or other formats. Use cases varies from ssr-frameworks (ie: nextjs [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props)) / loggers (sentry, winston...).

Nested error causes are supported but ignored [if not supported](#about-errorcause) by the runtime. Causes deeper than 10 levels are dropped.

Payloads might come from untrusted sources: `fromJson` never throws and returns a `SerializerError` when the json or the payload is invalid (`createFromSerializable` throws a `SerializerError`).

Additionally, you can pass any native errors (`Error`, `EvalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, `URIError`) as well as a custom one (the later will be transformed to the base type Error).

⚠️ **Since v3.0.0**:

For security reasons [stack traces](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack) won't be serialized anymore by default as they might contain sensitive information in production. To opt-in selectively for stack traces serialization (ie: development or logging) `convertToSerializable`, `createFromSerializable`, `toJson` and `fromJson` functions accepts a `SerializerParams.includeStack` param as second argument.

### JSON

```typescript
import { fromJson, toJson } from "@httpx/exception/serializer";

const e = new HttpForbidden();

const json = toJson(e); // string
const deserialized = fromJson(json);

// e === deserialized
```

> **Tip** See also how to integrate with [superjson](https://github.com/blitz-js/superjson#recipes)

<details>
<summary>Example for stack traces serialization.</summary>

```typescript
import { fromJson, toJson } from "@httpx/exception/serializer";

// To include stack traces (not safe in production)
const jsonWithStack = toJson(new HttpException(500), {
  includeStack: process.env.NODE_ENV === "development",
});

const eWithStrack = fromJson(json, {
  includeStack: process.env.NODE_ENV === "development",
});
```

</details>

### Serializable

Same as JSON but before json.parse/stringify. Allows to use a different encoder.

```typescript
import {
  convertToSerializable,
  createFromSerializable,
} from "@httpx/exception/serializer";

const e = new HttpForbidden({
  cause: new Error("Token was revoked"),
});

const serializableObject = convertToSerializable(e);
const deserialized = createFromSerializable(serializableObject);
// e === deserialized
```

<details>
<summary>Example for stack traces serialization.</summary>

```typescript
import {
  convertToSerializable,
  createFromSerializable,
} from "@httpx/exception/serializer";

const serializableObject = convertToSerializable(e, {
  includeStack: process.env.NODE_ENV === "development",
});
const deserialized = createFromSerializable(serializableObject, {
  includeStack: process.env.NODE_ENV === "development",
});
```

</details>

## Default messages

Messages are inferred from the Http exception class name. They are [compatible](https://github.com/belgattitude/httpx/blob/main/packages/exception/test/specs/statuses-messages-compatibility.test.ts) with the popular [statuses](https://www.npmjs.com/package/statuses) package.

| Status | Class                           | Message                         |
| ------ | ------------------------------- | ------------------------------- |
| 400    | HttpBadRequest                  | Bad request                     |
| 401    | HttpUnauthorized                | Unauthorized                    |
| 402    | HttpPaymentRequired             | Payment required                |
| 403    | HttpForbidden                   | Forbidden                       |
| 404    | HttpNotFound                    | Not found                       |
| 405    | HttpMethodNotAllowed            | Method not allowed              |
| 406    | HttpNotAcceptable               | Not acceptable                  |
| 407    | HttpProxyAuthenticationRequired | Proxy authentication required   |
| 408    | HttpRequestTimeout              | Request timeout                 |
| 409    | HttpConflict                    | Conflict                        |
| 410    | HttpGone                        | Gone                            |
| 411    | HttpLengthRequired              | Length required                 |
| 412    | HttpPreconditionFailed          | Precondition failed             |
| 413    | HttpPayloadTooLarge             | Payload too large               |
| 414    | HttpUriTooLong                  | Uri too long                    |
| 415    | HttpUnsupportedMediaType        | Unsupported media type          |
| 416    | HttpRangeNotSatisfiable         | Range not satisfiable           |
| 417    | HttpExpectationFailed           | Expectation failed              |
| 418    | HttpImATeapot                   | Im a teapot                     |
| 421    | HttpMisdirectedRequest          | Misdirected request             |
| 422    | HttpUnprocessableEntity         | Unprocessable entity            |
| 423    | HttpLocked                      | Locked                          |
| 424    | HttpFailedDependency            | Failed dependency               |
| 425    | HttpTooEarly                    | Too early                       |
| 426    | HttpUpgradeRequired             | Upgrade required                |
| 428    | HttpPreconditionRequired        | Precondition required           |
| 429    | HttpTooManyRequests             | Too many requests               |
| 431    | HttpRequestHeaderFieldsTooLarge | Request header fields too large |
| 451    | HttpUnavailableForLegalReasons  | Unavailable for legal reasons   |

Server http status error code

| Status | Class                             | Message                         |
| ------ | --------------------------------- | ------------------------------- |
| 500    | HttpInternalServerError           | Internal server error           |
| 501    | HttpNotImplemented                | Not implemented                 |
| 502    | HttpBadGateway                    | Bad gateway                     |
| 503    | HttpServiceUnavailable            | Service unavailable             |
| 504    | HttpGatewayTimeout                | Gateway timeout                 |
| 505    | HttpVersionNotSupported           | Http version not supported      |
| 506    | HttpVariantAlsoNegotiates         | Variant also negotiates         |
| 507    | HttpInsufficientStorage           | Insufficient storage            |
| 508    | HttpLoopDetected                  | Loop detected                   |
| 510    | HttpNotExtended                   | Not extended                    |
| 511    | HttpNetworkAuthenticationRequired | Network authentication required |

### Non-official status codes

While their usage is not recommended, some status codes might be found in the wild (generally server status codes).

```typescript
import { createHttpException, HttpServerException } from "@httpx/exception";

const nonOfficialStatusCodes = [
  [509, "Might refer to bandwidth limit"],
  [525, "Might refer to SSL Handshake Failed (ie: cloudflare)"],
  [526, "Might refer to Invalid SSL Certificate (ie: cloudflare)"],
  ["...", "..."],
];

const e = createHttpException(509, {
  message: "Bandwidth limit exceeded",
  // ... others properties
});

// e instanceof HttpServerException

// alternatively
const alternate = new HttpServerException({
  statusCode: 509,
  message: "Bandwidth limit exceeded",
  // ... others properties
});
```

## Helpers

### isErrorWithErrorStatusCode

This typeguard is based on a convention and might help to convert a native error to a specific HttpException.

```typescript
import {
  isErrorWithErrorStatusCode,
  createHttpException,
  type isErrorWithErrorStatusCode,
} from "@httpx/exception";

try {
  throw new (class extends Error {
    statusCode = 400; // <- by convention
  })();
} catch (e) {
  // will check if the value is an Error and that there's a statusCode is >=400 && <600
  if (isErrorWithErrorStatusCode(e)) {
    throw createHttpException(e.statusCode, e.message);
  }
}
```

### isObjectWithErrorStatusCode

This typeguard is based on a convention and might help to convert an object to a specific HttpException.

```typescript
import {
  isObjectWithErrorStatusCode,
  createHttpException,
  type ObjectWithErrorStatusCode,
} from "@httpx/exception";

const noSuchUser = {
  statusCode: 404,
} satisfies ObjectWithErrorStatusCode;

class NoSuchItem extends DomainError implements ObjectWithErrorStatusCode {
  statusCode = 404;
}

if (isObjectWithErrorStatusCode(noSuchUser)) {
  throw createHttpException(e.statusCode, "Nothing");
}
```

## About bundle

### Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | Node >= 22.14. CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/exception/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Edge | ✅ | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime). |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.7+ / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
| ES2022 | ✅ | Dist files checked with [es-check](https://github.com/yowainwright/es-check) |

> For _older_ browsers:
>
> - 👉 Most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)
> - 👉 You might want to add the [error-cause-polyfill](https://github.com/ehmicky/error-cause-polyfill) to support nested errors (if not present they are simply discarded - no runtime errors).

### Bundle size

Code and bundler have been tuned to target a minimal compressed footprint for the browser. In ESM, typical usage the bundle size will vary between 600b to 1700b compressed (including default messages for the 43 status codes).

ESM individual imports are tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/exception/.size-limit.cjs).

| Scenario                                           | Size (compressed) |
| -------------------------------------------------- | ----------------: |
| Import generic exception (`HttpClientException`)   |            ~ 550b |
| Import 1 client exception                          |            ~ 595b |
| Import 2 client exceptions                         |            ~ 616b |
| Import 6 client exceptions                         |            ~ 719b |
| Import `createHttpException` (all 43 exceptions)   |           ~ 1647b |
| Import `fromJson` (incl all + createHttpException) |           ~ 2168b |
| All serializer functions + exceptions + typeguards |           ~ 2439b |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/exception@latest).

### Packaging

This library offers a dual cjs/esm bundle. The (optional) serializer code has been tuned to avoid issues with [dual package hazards](https://nodejs.org/api/packages.html#dual-package-hazard).

The export fields and the builds are checked on the CI with [are-the-types-wrong](https://arethetypeswrong.github.io/).

> PS: Plans to remove cjs support might land in a next major version.

### Typescript

This library targets typescript 5.7+ with descriptions (see [the generated api docs](https://github.com/belgattitude/httpx/tree/main/packages/exception/docs/api)).

## Upgrade

> Refer to the [UPGRADE.md](https://github.com/belgattitude/httpx/blob/main/packages/exception/UPGRADE.md) for detailed information.

| Version | Comment |
| --- | --- |
| 4.x | Node 22.14+, typeguards require a numeric statusCode, `fromJson` never throws |
| 3.x | Serializer functions don't include stack by default |
| 2.x | Node 18.x, modern browsers (see how to [transpile](#compatibility)) |

## Support

Open [an issue on github](https://github.com/belgattitude/httpx/issues).

## Contributors

Contributions are warmly appreciated. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together! [Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>), or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
    <td>
      <a href="https://www.embie.be/?ref=belgattitude" target="_blank">
        <img width="65" src="https://avatars.githubusercontent.com/u/98402122?s=200&v=4" alt="Jetbrains logo" />    
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
    <td align="center">
      <a href="https://www.embie.be/?ref=belgattitude" target="_blank">Embie.be</a>
    </td>
   </tr>
</table>

## License

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
