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

- 🚀&nbsp; Simple use: [explicit named imports](https://belgattitude.github.io/httpx/#/?id=named-exceptions) and/or [status code](https://belgattitude.github.io/httpx/#/?id=factories).
- ✨‍&nbsp; Default statusText as [error message](https://belgattitude.github.io/httpx/#/?id=about-default-message). Less to type, reduce divergence...
- 🎥&nbsp; Optionally attach some common [contextual](https://belgattitude.github.io/httpx/#/?id=about-context) info (less guessing, loggers...).
- 🐎&nbsp; Built-in [serializer](https://belgattitude.github.io/httpx/#/?id=serializer) to cover Server-Side-Rendering use-cases (nextjs, superjson,...).
- 🎯&nbsp; [Extends](https://belgattitude.github.io/httpx/#/?id=uml-class-diagram) Error class with [stack](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack) trace and [Error.cause](https://belgattitude.github.io/httpx/#/?id=about-errorcause) support.
- 📡&nbsp; Framework agnostic, no deps. Works everywhere: node, browsers, edge...
- 🍃&nbsp; [Lightweight](https://bundlephobia.com/package/@httpx/exception@latest) - [treeshakable](https://github.com/belgattitude/httpx/blob/main/packages/exception/.size-limit.cjs) - wide [browser coverage](https://browserslist.dev/?q=PiAwLjAxJSwgbm90IGRlYWQ%3D) (trade-off).
- 🧙‍&nbsp; IDE friendly. Typescript - typedoc with links to mdn and description.
- 🥃&nbsp; [Docs](https://belgattitude.github.io/httpx) & [changelogs](https://github.com/belgattitude/httpx/releases) - Well tested and maintained - [Contributors](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) welcome.

## Install

```bash
npm install @httpx/exception  # via npm
yarn add @httpx/exception     # via yarn
pnpm add @httpx/exception     # via pnpm
```

## Documentation

**👉 See full documentation on [https://belgattitude.github.io/httpx](https://belgattitude.github.io/httpx). 👈**

## Why ?

At infra / http level using http exceptions (thrown or not) might help to build central error handling, improve logging
abilities (backtraces, error cause...) or simply help to build a serializer (ie: [json-api](https://jsonapi.org/examples/#error-objects-basics)).
Http exceptions are generally built-in in frameworks (ie: nestjs, tsed...), `@httpx/exception` is a standalone implementation
with a small footprint. It can be used / mapped (but not confused) with domain errors (NoSuchUser,...) or other
infra errors (ie: [prisma](https://www.prisma.io/blog/nestjs-prisma-error-handling-7D056s1kOop2)...)

## A quick taste

Illustrative example (based on nextjs api route)

```typescript
// ie: ./pages/api/v1/product/[slug].ts
import type { NextApiHandler } from "next";
import { withApiErrorHandler } from "@/backend/hof/withApiErrorHandler";
import { HttpNotFound, HttpForbidden } from "@httpx/exception";

const getProductHandler: NextApiHandler = async (req, res) => {
  const { slug } = req.query;
  if (!req.headers["authorization"]) {
    throw new HttpForbidden();
  }
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    throw new HttpNotFound(`Product '${slug}' can't be found`);
  }
  res.json({ success: true, product });
};

// Possible example of a global error handler with a higher order function
export default withApiErrorHandler({
  logger: new ConsoleLogger(),
})(getProductHandler);
```

Example for a global catcher.

```typescript
// ie: ./backend/hof/withApiErrorHandler.ts
import type { HttpException } from "@httpx/exception";
import { isHttpException } from "@httpx/exception";
import { toJson } from "@httpx/exception/serializer";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type Params = {
  logger?: LoggerInterface;
  defaultStatusCode?: number;
};

export const withApiErrorHandler = (params?: Params) => {
  const { logger = new ConsoleLogger(), defaultStatusCode = 500 } =
    params ?? {};
  return (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
        await handler(req, res);
      } catch (e) {
        const statusCode = isHttpException(e)
          ? e.statusCode
          : defaultStatusCode;
        logger.log(`${statusCode} - ${req.url}`, toJson(e)); // or via convertToSerializable
        res.setHeader("content-type", "application/json");
        res.status(payload.statusCode).end(
          JSON.stringify({
            success: false,
            error: {
              statusCode,
              message: e.message,
            },
          })
        );
      }
    };
};
```

> Tip: @httpx/exception is small scoped by nature. The above example isn't to be taken "as is".

## Quick overview

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
