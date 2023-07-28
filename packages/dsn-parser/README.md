# @httpx/dsn-parser

DSN parser, validation utilities, and query string helper in a light and modern package.

[![npm](https://img.shields.io/npm/v/@httpx/dsn-parser?style=for-the-badge&labelColor=222)](https://www.npmjs.com/package/@httpx/dsn-parser)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/dsn-parser@latest?label=Max&style=for-the-badge&labelColor=333&color=informational)](https://bundlephobia.com/package/@httpx/dsn-parser@latest)
![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm|treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)
![node](https://img.shields.io/static/v1?label=Node&message=16%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=modern&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](https://browserslist.dev/?q=ZGVmYXVsdHMgYW5kIHN1cHBvcnRzIGVzNi1tb2R1bGUsIG5vdCBkZWFkLCBub3Qgb3BfbWluaSBhbGwsIG5vZGUgMTY%3D)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?label=unit&logo=codecov&flag=dsnParserUnit&style=for-the-badge&labelColor=000000)](https://codecov.io/gh/belgattitude/httpx)
![types](https://img.shields.io/static/v1?label=typings&message=4.5%2B&logo=typescript&style=for-the-badge&labelColor=000000&color=9cf)
[![npm](https://img.shields.io/npm/dm/@httpx/dsn-parser?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/@httpx/dsn-parser)
[![license](https://img.shields.io/npm/l/@httpx/dsn-parser?style=for-the-badge&labelColor=000000)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/dsn-parser
$ yarn add @httpx/dsn-parser
$ pnpm add @httpx/dsn-parser
```

## Features

- [x] Parse individual fields (ie: `driver`, `user`, `password`, `host`...)
- [x] Handle query string with casting of boolean and numeric values.
- [x] Handle [special characters like](#why--in-password-matters) `/`, `:`... in the password (some libs won't).
- [x] Error with indicative message / reasons (discriminative union or throwing).
- [x] Don't leak passwords in the error message.
- [x] Assertion and typeguard helpers (ie: [easy integrate with zod](#zod-integration-example)).

## Quick start

### parseDsnOrThrow

Usage with exceptions

```typescript
import { parseDsnOrThrow } from "@httpx/dsn-parser";

const dsn = "redis://user:p@/ssword@localhost:6379/0?ssl=true";

try {
  const parsedDsn = parseDsnOrThrow(dsn);
  assert.deepEqual(parsedDsn, {
    driver: "redis",
    pass: "p@/ssword",
    host: "localhost",
    user: "user",
    port: 6379,
    db: "0",
    params: {
      ssl: true,
    },
  });
} catch (e) {
  // example:
  // e -> Error("Can't parse dsn: Invalid port: 12345678 (INVALID_PORT)")
}
```

### parseDsn

Usage with discriminated union.

```typescript
import { parseDsn } from "@httpx/dsn-parser";

const dsn = "redis://user:p@/ssword@localhost:6379/0?ssl=true";

const parsed = parseDsn(dsn);

if (parsed.success) {
  assert.deepEqual(parsed.value, {
    driver: "redis",
    pass: "p@/ssword",
    host: "localhost",
    user: "user",
    port: 6379,
    db: "0",
    params: {
      ssl: true,
    },
  });
} else {
  assert.deepEqual(parsed, {
    success: false,
    // Reasons might vary
    reason: "INVALID_PORT",
    message: "Invalid http port: 12345678",
  });
}
```

## Options

```typescript
const dsn = "mySql://localhost:6379/db";
const parsed = parseDsn(dsn, {
  lowercaseDriver: true,
  overrides: {
    db: "db3",
    port: undefined,
  },
});

assert.deepEqual(parsed.value, {
  driver: "mysql",
  host: "localhost",
  db: "db3",
});
```

| Params            | Type                   | Description                               |
| ----------------- | ---------------------- | ----------------------------------------- |
| `lowercaseDriver` | `<boolean>`            | Driver name in lowercase, default `false` |
| `overrides`       | `DSN must be a string` |                                           |

### Assertion

```typescript
import { assertParsableDsn, ParsableDsn } from "@httpx/dsn-parser";

try {
  assertParsableDsn("redis:/");
  // Type is narrowed to string (ParsableDsn) if it
  // didn't throw.
} catch (e) {
  assert.equal(e.message, "Cannot parse DSN (PARSE_ERROR)");
}
```

### Typeguard

```typescript
import { isParsableDsn, type ParsableDsn } from "@httpx/dsn-parser";

const dsn = "postgresql://localhost:6379/db";

if (isParsableDsn(dsn)) {
  // known to be ParsableDSN
}
```

## DSN parsing

### Requirements

The minimum requirement for dsn parsing is to have a **host** and
a **driver** _`(/[a-z0-9]+/i)`_ defined. All other options are optional.

```typescript
export type ParsedDsn = {
  driver: string;
  host: string;
  user?: string;
  pass?: string;
  port?: number;
  db?: string;
  /** Query params */
  params?: Record<string, number | string | boolean>;
};
```

### DSN support

Things like:

```typescript
const validExamples = [
  "postgresql://postgres:@localhost:5432/prisma-db",
  "redis://us_er-name:P@ass-_:?/ssw/rd@www.example.com:6379/0?cache=true",
  //...
];
```

should work.

### Query parameters

Simple query parameters are supported (no arrays, no nested). For convenience
it will cast `'true'` and `'false'` to **booleans**,
parse numeric string to **numbers** if possible. When a query
parameter does not contain a value, it will be returned as `true`.

```typescript
const dsn = "redis://host?index=1&compress=false&ssl";
const parsed = parseDsn(dsn);
assert.deepEqual(parsed.value.params, {
  index: 1,
  compress: false,
  ssl: true,
});
```

### Portability

`parseDsn` won't make any assumptions on default values _(i.e: default port for mysql...)_.

### Validation

`parseDsn` wraps its result in a [discriminated union](https://basarat.gitbook.io/typescript/type-system/discriminated-unions)
to allow the retrieval of validation errors. No `try... catch`needed and full typescript support.

Reason codes are guaranteed in semantic versions and messages does not
leak credentials

```typescript
const parsed = parseDsn("redis://localhost:65636");
assert.deepEqual(parsed, {
  success: false,
  reason: "INVALID_PORT",
  message: "Invalid port: 65636",
});
if (!parsed.success) {
  // `success: false` narrows the type to
  // {
  //   reason: 'PARSE_ERROR'|'INVALID_ARGUMENT'|...
  //   message: string
  // }
  log(parsed.reason);
}
```

| Reason               | Message                 | Comment         |
| -------------------- | ----------------------- | --------------- |
| `'PARSE_ERROR'`      | `Cannot parse DSN`      | _Regexp failed_ |
| `'INVALID_ARGUMENT'` | `DSN must be a string`  |                 |
| `'EMPTY_DSN'`        | `DSN cannot be empty`   |                 |
| `'INVALID_PORT'`     | `Invalid port: ${port}` | [1-65535]       |

## Faq

### Zod integration example

The `isParsableDsn` can be easily plugged into zod custom validation. Example:

```typescript
import { z } from "zod";

export const serverEnvSchema = z.object({
  PRISMA_DATABASE_URL: z.custom(
    (dsn) => isParsableDsn(dsn),
    "Invalid DSN format."
  ),
});

serverEnvSchema.parse(process.env);
```

### Why '/' in password matters

Some libs (ioredis...) still might fail parsing a password containing '/',
unfortunately they're pretty convenient, i.e:

```bash
openssl rand 60 | openssl base64 -A

# YFUXIG9INIK7dFyE9aXtxLmjmnYL0zv6YluBJJbC6alKIBema/MwEGy3VUpx0oLAvWHUFGFMagAdLxrB
```

## Sponsors ❤️

If you are enjoying some of my OSS guides or libs for your company, I'd really appreciate a [sponsorship](https://github.com/sponsors/belgattitude), a [coffee](https://ko-fi.com/belgattitude) or a dropped star. That gives me a tasty morning boost and help me to make some of my ideas come true 🙏

### Special thanks

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
