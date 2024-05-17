# @httpx/dsn-parser

## 1.8.0

### Minor Changes

- [`ad7345f`](https://github.com/belgattitude/httpx/commit/ad7345f38026516106eb057d4e8210b94e98bf2d) Thanks [@belgattitude](https://github.com/belgattitude)! - Drop "official" support for node 16 and typesript < 5

## 1.7.1

### Patch Changes

- [#1154](https://github.com/belgattitude/httpx/pull/1154) [`6a52be7`](https://github.com/belgattitude/httpx/commit/6a52be772efd39c8270f26993d718b180d726539) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild using esbuild 0.20.2

## 1.7.0

### Minor Changes

- [#1020](https://github.com/belgattitude/httpx/pull/1020) [`60c2162`](https://github.com/belgattitude/httpx/commit/60c21625183e44246f4b974f30ceb48faa6c3a09) Thanks [@belgattitude](https://github.com/belgattitude)! - Add WeakOpaqueType support for ParsableDsn

### Patch Changes

- [#1020](https://github.com/belgattitude/httpx/pull/1020) [`60c2162`](https://github.com/belgattitude/httpx/commit/60c21625183e44246f4b974f30ceb48faa6c3a09) Thanks [@belgattitude](https://github.com/belgattitude)! - Hoist number regexp outside of function

## 1.6.8

### Patch Changes

- [`28687e1`](https://github.com/belgattitude/httpx/commit/28687e16e42019d3d9f7fb1d5d6180a87a2b3324) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with npm provenance

## 1.6.7

### Patch Changes

- [#877](https://github.com/belgattitude/httpx/pull/877) [`e329bcd`](https://github.com/belgattitude/httpx/commit/e329bcd54a5daa4eafb8a9e95117eb2bc07cad1a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add npm provenance to releases

## 1.6.6

### Patch Changes

- [#875](https://github.com/belgattitude/httpx/pull/875) [`b6e2941`](https://github.com/belgattitude/httpx/commit/b6e2941134fcc3de7cde6666067f202f8b6de408) Thanks [@belgattitude](https://github.com/belgattitude)! - Update to rollup 4.9.4

## 1.6.5

### Patch Changes

- [#858](https://github.com/belgattitude/httpx/pull/858) [`76fd8dc`](https://github.com/belgattitude/httpx/commit/76fd8dc1500125534033845029144ddc091a74a7) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with no changes

## 1.6.4

### Patch Changes

- [#832](https://github.com/belgattitude/httpx/pull/832) [`321957a`](https://github.com/belgattitude/httpx/commit/321957a9eced15ff132c2ab18789bc4bcde9ff95) Thanks [@belgattitude](https://github.com/belgattitude)! - esbuild updated to 0.19.11 to fix a potential typeScript-specific class transform edge case

## 1.6.3

### Patch Changes

- [#781](https://github.com/belgattitude/httpx/pull/781) [`4e2b795`](https://github.com/belgattitude/httpx/commit/4e2b795a69914f22d01a5137ce38e9fb39e40ed7) Thanks [@belgattitude](https://github.com/belgattitude)! - Ensure compat for Chrome 96+, Firefox 90+, Edge 19+, Safari 12+, Opera 77+

## 1.6.2

### Patch Changes

- [#744](https://github.com/belgattitude/httpx/pull/744) [`def4ba2`](https://github.com/belgattitude/httpx/commit/def4ba282426d46e1e3bca963754612d44b4564d) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix the documentation home page

## 1.6.1

### Patch Changes

- [#724](https://github.com/belgattitude/httpx/pull/724) [`8d02a2a`](https://github.com/belgattitude/httpx/commit/8d02a2a516aaf42ff5e002889938c6282c862b47) Thanks [@belgattitude](https://github.com/belgattitude)! - Optimize code thanks to eslint unicorn plugin

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
