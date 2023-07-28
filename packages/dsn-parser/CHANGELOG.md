# @httpx/dsn-parser

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
