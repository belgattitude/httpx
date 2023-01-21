# @httpx/exception

Plain http exceptions for node, deno, edge and browsers. No deps, lightweight, first class typescript
experience. Offer a built-in serializer in case you'll need it in hybrid context (àlà nextjs) or for logging
purposes.

[![npm](https://img.shields.io/npm/v/@httpx/exception?style=for-the-badge&labelColor=222)](https://www.npmjs.com/package/@httpx/exception)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/exception@latest?label=Max&style=for-the-badge&labelColor=333&color=informational)](https://bundlephobia.com/package/@httpx/exception@latest)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm|treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/exception/.size-limit.cjs)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=>99%&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](https://browserslist.dev/?q=PiAwLjAxJSwgbm90IGRlYWQ%3D)
[![node](https://img.shields.io/static/v1?label=Node&message=14%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](https://browserslist.dev/?q=PjAuMjUlLCBub3QgZGVhZA%3D%3D)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&style=for-the-badge&labelColor=444)](https://codecov.io/gh/belgattitude/httpx)
[![techdebt](https://img.shields.io/codeclimate/tech-debt/belgattitude/httpx?label=TechDebt&logo=code-climate&style=for-the-badge&labelColor=444)](https://codeclimate.com/github/belgattitude/httpx)
[![maintainability](https://img.shields.io/codeclimate/maintainability/belgattitude/httpx?label=Maintainability&logo=code-climate&style=for-the-badge&labelColor=444)](https://codeclimate.com/github/belgattitude/httpx)
[![npm](https://img.shields.io/npm/dt/@httpx/exception?style=for-the-badge)](https://www.npmjs.com/package/@httpx/exception)
[![license](https://img.shields.io/npm/l/@httpx/exception?style=for-the-badge&labelColor=000000)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Highlights

- 🚀&nbsp; Dead simple: [explicit named imports](https://belgattitude.github.io/httpx/#/?id=named-exceptions) and/or [status code](https://belgattitude.github.io/httpx/#/?id=factories).
- 📡&nbsp; Works everywhere: node, browsers, edge... framework agnostic, no deps.
- 🎥&nbsp; Logger friendly with [contextual](https://belgattitude.github.io/httpx/#/?id=about-context) info. Less guessing games.
- 🐎&nbsp; [Serializable](https://belgattitude.github.io/httpx/#/?id=serializer) to cover Server-Side-Rendering use-cases (nextjs, superjson,...).
- 🎯&nbsp; Up to standards. [extends](https://belgattitude.github.io/httpx/#/?id=uml-class-diagram) Error class with [stack](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack) and [Error.cause](https://belgattitude.github.io/httpx/#/?id=about-errorcause) support.
- 🍃&nbsp; [Lightweight](https://bundlephobia.com/package/@httpx/exception@latest) - [treeshakable](https://github.com/belgattitude/httpx/blob/main/packages/exception/.size-limit.cjs) - wide [browser coverage](https://browserslist.dev/?q=PiAwLjAxJSwgbm90IGRlYWQ%3D) (trade-off).
- ✨‍&nbsp; Default statusText as [error message](https://belgattitude.github.io/httpx/#/?id=about-default-message). Less chars, divergence...
- 🧙‍&nbsp; IDE friendly. Typescript - typedoc with links to mdn and description.
- 🥃&nbsp; [Docs](https://belgattitude.github.io/httpx) & [changelogs](https://github.com/belgattitude/httpx/releases) - Well tested and maintained - [Contributors](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) welcome.

## Documentation

**👉 See full documentation on [https://belgattitude.github.io/httpx](https://belgattitude.github.io/httpx). 👈**

## Install

```bash
npm install @httpx/exception  # via npm
yarn add @httpx/exception     # via yarn
```

## Quick start

Simple named exceptions:

```typescript
import {
  HttpGatewayTimeout,
  HttpInternalServerError,
  HttpNotFound,
  HttpServiceUnavailable,
} from "@httpx/exception";

throw new HttpNotFound(); // message = 'Not found', statusCode = 404

// Custom message
throw new HttpServiceUnavailable("Service temporarily unavailable");

// Custom context
throw new HttpInternalServerError({
  message: "Oups, this is on our side.",
  url: "https://api.dev/gateway",
  code: "EXTERNAL_SERVICE_TIMEOUT",
  cause: new HttpGatewayTimeout({
    code: "This Serverless Function has timed out",
    errorId: "cdg1::h99k2-1664884491087-b41a2832f559",
  }),
});
```

By status code

```typescript
import { createHttpException } from "@httpx/exception";

const e404 = createHttpException(404);
const e500 = createHttpException(500, { message: "Server error" });
```

Serialization

```typescript
import { fromJson, toJson } from "@httpx/exception/serializer";

const e = new HttpForbidden();

const json = toJson(e);
const deserialized = fromJson(json);
```

More in the docs: [https://belgattitude.github.io/httpx](https://belgattitude.github.io/httpx)

## Support

Don't hesitate and open [an issue](https://github.com/belgattitude/httpx/issues).

## Contributors

Contributions are warmly appreciated. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors ♥

If you are enjoying some of my OSS guides or libs for your company, I'd really appreciate a [sponsorship](https://github.com/sponsors/belgattitude), a [coffee](https://ko-fi.com/belgattitude) or a dropped star. That gives me a tasty morning boost and help me to make some of my ideas come true 🙏

## License

MIT
