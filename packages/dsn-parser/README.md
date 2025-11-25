# @httpx/dsn-parser

DSN & JDBC string parser with query params support in a light ([~750B](#bundle-size)) and modern package.

[![npm](https://img.shields.io/npm/v/@httpx/dsn-parser?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/dsn-parser)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/dsn-parser/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-dsn-parser-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fdsn-parser)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/dsn-parser/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/dsn-parser@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/dsn-parser@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/dsn-parser?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/dsn-parser)
[![license](https://img.shields.io/npm/l/@httpx/dsn-parser?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/dsn-parser
$ yarn add @httpx/dsn-parser
$ pnpm add @httpx/dsn-parser
```

## Features

- 👉&nbsp; Parse individual fields (ie: `driver`, `user`, `password`, `host`...)
- 🖖&nbsp; Handle query string parameters and converts to boolean and numeric values.
- 🦄&nbsp; Handle [special characters like](#why--in-password-matters) `/`, `:`... in the password (some libs won't).
- 🚀&nbsp; Error with indicative message / reasons (discriminated union or throwable).
- 🛡️&nbsp; Don't leak passwords in the error message.
- 🙏&nbsp; Assertion and typeguard helpers
- 🤗&nbsp; Ecosystem friendly (ie: [zod integration](#zod-integration-example)).
- ♾️️&nbsp; Tested on [node 20-25, browser, bun, cloudflare workers and runtime/edge](#compatibility).

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/dsn-parser) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/dsn-parser#readme)

## Usage

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

### Options

```typescript
import { parseDsn, type ParseDsnOptions } from "@httpx/dsn-parser";

const dsn = "mySql://localhost:6379/db";
const parsed = parseDsn(dsn, {
  lowercaseDriver: true,
  // Overrides, allows to force some values (ParseDsnOptions)
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
| `lowercaseDriver` | `boolean`              | Driver name in lowercase, default `false` |
| `overrides`       | `ParseDsnOptions`      | Overrides allows to force specific values |

## Utilities

### Typeguard

```typescript
import { isParsableDsn, type ParsableDsn } from "@httpx/dsn-parser";

const dsn = "postgresql://localhost:6379/db";

if (isParsableDsn(dsn)) {
  // known to be ParsableDsn
}
```

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

### ParsableDsn

ParsableDsn is a weak opaque type.  

```typescript
declare const tag: unique symbol;
export type WeakOpaqueContainer<Token> = {
  readonly [tag]: Token;
};
export type ParsableDsn = string & WeakOpaqueContainer<'ParsableDsn'>;
```

It can be used to enforce that the `isParsableDsn` or `assertParsableDsn` have been
used before usage. 

```typescript
import type { ParsableDsn } from "./dsn-parser.type";
import { assertParsableDsn } from "./assert-parsable-dsn";

// to opt-in, just change the dsn param type to `ParsableDsn` instead of `string` 
const fnWithWeakOpaqueType = (dsn: ParsableDsn) => {
    // by explictly requiring a ParsableDsn, we can rely on typescript
    // to be sure that a validation has occured before (isParsableDsn or assertParsableDsn)  
}

fnWithWeakOpaqueType('redis://localhost');  // ❌ typescript will complain

const dsn = 'redis://localhost';
assertParsableDsn(dsn);
fnWithWeakOpaqueType(dsn);  // ✅ working cause it was checked before

```

> PS: WeakOpaque usage is totally optional, a nice to have if applicable

### convertJdbcToDsn

Utility to convert [jdbc](https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) dsn.
Useful for prisma using [sqlserver](https://www.prisma.io/docs/concepts/database-connectors/sql-server#connection-details).

```typescript
import { convertJdbcToDsn } from "@httpx/dsn-parser";

const jdbcDsn =
  "sqlserver://localhost:1433;database=my-db;authentication=default;user=sa;password=pass03$;encrypt=true;trustServerCertificate=true";

const dsn = convertJdbcToDsn(jdbc);

// -> 'sqlserver://localhost:1433?database=my-db&authentication=default&user=sa&password=pass03$&encrypt=true&trustServerCertificate=true'
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

## Ecosystem

### Zod integration example

The `isParsableDsn` can be easily plugged into zod custom validation. Example:

```typescript
import { z } from "zod";
import { isParsableDsn, type ParsableDsn } from "@httpx/dsn-parser";

export const serverEnvSchema = z.object({
  PRISMA_DATABASE_URL: z.custom<ParsableDsn>(
    (dsn) => isParsableDsn(dsn),
    "Invalid DSN format."
  ),
});

serverEnvSchema.parse(process.env);
```

## Faq

### Why '/' in password matters

Some libs (ioredis...) still might fail parsing a password containing '/',
unfortunately they're pretty convenient, i.e:

```bash
openssl rand 60 | openssl base64 -A

# YFUXIG9INIK7dFyE9aXtxLmjmnYL0zv6YluBJJbC6alKIBema/MwEGy3VUpx0oLAvWHUFGFMagAdLxrB
```

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/dsn-parser/.size-limit.cjs)

| Scenario (esm)                                           | Size (compressed) |
|----------------------------------------------------------|------------------:|
| `import { parseDsn } from '@httpx/dsn-parser`            |            ~ 750B |


## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                     |
|--------------|----|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅   | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                   |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/dsn-parser/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                              |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                              | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                                |
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                                   |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                    |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

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
