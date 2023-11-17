# @httpx/dsn-parser

## 1.6.0

### Minor Changes

- [#719](https://github.com/belgattitude/httpx/pull/719) [`bae6ce0`](https://github.com/belgattitude/httpx/commit/bae6ce05a85822b0ec4658b679e82ce4efa9222f) Thanks [@belgattitude](https://github.com/belgattitude)! - Move to esm first (dual cjs/mjs is till supported in the mid-term)

- [#719](https://github.com/belgattitude/httpx/pull/719) [`bae6ce0`](https://github.com/belgattitude/httpx/commit/bae6ce05a85822b0ec4658b679e82ce4efa9222f) Thanks [@belgattitude](https://github.com/belgattitude)! - Restore node 16 official support / ES2021 (was working anyway)

### Patch Changes

- [#719](https://github.com/belgattitude/httpx/pull/719) [`bae6ce0`](https://github.com/belgattitude/httpx/commit/bae6ce05a85822b0ec4658b679e82ce4efa9222f) Thanks [@belgattitude](https://github.com/belgattitude)! - Upgrade tsup to 7.3 and build with esbuild 0.19.3

## 1.5.0

### Minor Changes

- [#669](https://github.com/belgattitude/httpx/pull/669) [`5d3be6a`](https://github.com/belgattitude/httpx/commit/5d3be6a5f31771f9a25b95096a7f1695942a9644) Thanks [@belgattitude](https://github.com/belgattitude)! - Drop node 16 support, es2022, slight bundle size decrease

## 1.4.0

### Minor Changes

- [#649](https://github.com/belgattitude/httpx/pull/649) [`339e8a3`](https://github.com/belgattitude/httpx/commit/339e8a3c558e5d199a224b877f77b10734e9a870) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce dsn regexp character lengths (reduce complexity)

## 1.3.0

### Minor Changes

- [#619](https://github.com/belgattitude/httpx/pull/619) [`b7587cd`](https://github.com/belgattitude/httpx/commit/b7587cdee67c73fbad470ffc2273f2eeba43a414) Thanks [@belgattitude](https://github.com/belgattitude)! - Add convertJdbcToDsn utility function
  Helps to convert [jdbc](https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) dsn.
  Useful for prisma using [sqlserver](https://www.prisma.io/docs/concepts/database-connectors/sql-server#connection-details).

  ```typescript
  import { convertJdbcToDsn } from '@httpx/dsn-parser';

  const jdbcDsn =
      'sqlserver://localhost:1433;database=my-db;authentication=default;user=sa;password=pass03$;encrypt=true;trustServerCertificate=true';

  const dsn = convertJdbcToDsn(jdbc);

  // -> 'sqlserver://localhost:1433?database=my-db&authentication=default&user=sa&password=pass03
  encrypt=true&trustServerCertificate=true'
  ```

## 1.2.0

### Minor Changes

- [#532](https://github.com/belgattitude/httpx/pull/532) [`cfe1808`](https://github.com/belgattitude/httpx/commit/cfe180848a01e94ff475c2d27bdf1c9d3c007a2f) Thanks [@belgattitude](https://github.com/belgattitude)! - Lint with typescript-eslint v6, change || to ??.

- [#532](https://github.com/belgattitude/httpx/pull/532) [`cfe1808`](https://github.com/belgattitude/httpx/commit/cfe180848a01e94ff475c2d27bdf1c9d3c007a2f) Thanks [@belgattitude](https://github.com/belgattitude)! - Lint with typescript/eslint v6 strict

- [#532](https://github.com/belgattitude/httpx/pull/532) [`cfe1808`](https://github.com/belgattitude/httpx/commit/cfe180848a01e94ff475c2d27bdf1c9d3c007a2f) Thanks [@belgattitude](https://github.com/belgattitude)! - Narrow HttpStatusCode type from number to registered status codes (400,...,599)

## 1.1.0

### Minor Changes

- [#510](https://github.com/belgattitude/httpx/pull/510) [`a02984c`](https://github.com/belgattitude/httpx/commit/a02984c1d9c4caf45b957a3dd6adee3a5e3a4415) Thanks [@belgattitude](https://github.com/belgattitude)! - Support '+' character in driver

## 1.0.1

### Patch Changes

- [#505](https://github.com/belgattitude/httpx/pull/505) [`6dbbf43`](https://github.com/belgattitude/httpx/commit/6dbbf4302de24157cdc73a6179b64e1611c1db55) Thanks [@belgattitude](https://github.com/belgattitude)! - Transpile from es2020 to es2019 to widen browser support

## 1.0.0

### Major Changes

- [#496](https://github.com/belgattitude/httpx/pull/496) [`746390b`](https://github.com/belgattitude/httpx/commit/746390bcbb2edc9ccdafd2ed53bf412fdbb8bbd6) Thanks [@belgattitude](https://github.com/belgattitude)! - Minimum requirement bumped to node16 / es2019 / chrome90

  The dsn-parser package can be transpiled if you need support in older
  browsers. See your framework documentation for how to do this (ie [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)).

- [#496](https://github.com/belgattitude/httpx/pull/496) [`746390b`](https://github.com/belgattitude/httpx/commit/746390bcbb2edc9ccdafd2ed53bf412fdbb8bbd6) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix esm/cjs exported types thanks to arethetypeswrong and publint

### Minor Changes

- [#500](https://github.com/belgattitude/httpx/pull/500) [`c966acb`](https://github.com/belgattitude/httpx/commit/c966acb0b07329b3bf8a30fa1f84b39f175872c5) Thanks [@belgattitude](https://github.com/belgattitude)! - Ensure modern browser support.

### Patch Changes

- [#496](https://github.com/belgattitude/httpx/pull/496) [`746390b`](https://github.com/belgattitude/httpx/commit/746390bcbb2edc9ccdafd2ed53bf412fdbb8bbd6) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce total bundle size from 1.30kb to 1.13kb mingzip

  dsn-parser tree-shakes well, 1.13kb is the size of the full import.

## 0.10.1

### Patch Changes

- [#482](https://github.com/belgattitude/httpx/pull/482) [`5337e61`](https://github.com/belgattitude/httpx/commit/5337e6135a41497341c6a3b1653a9641508d4142) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve typecheck strictness

## 0.10.0

### Minor Changes

- [#468](https://github.com/belgattitude/httpx/pull/468) [`e78d112`](https://github.com/belgattitude/httpx/commit/e78d11203afa88da776f09c6b9f344ca32fa5ddc) Thanks [@belgattitude](https://github.com/belgattitude)! - Add @httpx/dsn-parser package

  Moving [@soluble/cache-interop](https://github.com/soluble-io/cache-interop/tree/main/packages/dsn-parser) to the
  @httpx org.
