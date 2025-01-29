# @httpx/memo-intl

## 1.2.0

### Minor Changes

- [#1868](https://github.com/belgattitude/httpx/pull/1868) [`9677ae3`](https://github.com/belgattitude/httpx/commit/9677ae38f2d97f4913fbec6542272cd82f7059ca) Thanks [@belgattitude](https://github.com/belgattitude)! - Now 30x faster than non memoized constructors (was 20x before)

  Now using [@httpx/lru](https://github.com/belgattitude/httpx/tree/main/packages/lru#readme) instead of [quick-lru](https://github.com/sindresorhus/quick-lru)

  Previously

  ```
    With memoization `MIntl.NumberFormatter()` - bench/m-intl.bench.ts > MIntl benchmarks
      21.64x faster than Without memoization `new Intl.NumberFormatter()`
  ```

  Now

  ```
    With memoization `MIntl.NumberFormatter()` - bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks
      32.18x faster than Without memoization `new Intl.NumberFormatter()`
  ```

- [#1868](https://github.com/belgattitude/httpx/pull/1868) [`9677ae3`](https://github.com/belgattitude/httpx/commit/9677ae38f2d97f4913fbec6542272cd82f7059ca) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce size from 1.2Kb to 900B by using @httpx/lru

  Now using [@httpx/lru](https://github.com/belgattitude/httpx/tree/main/packages/lru#readme) instead of [quick-lru](https://github.com/sindresorhus/quick-lru)

## 1.1.3

### Patch Changes

- [#1546](https://github.com/belgattitude/httpx/pull/1546) [`bdf9e19`](https://github.com/belgattitude/httpx/commit/bdf9e19d11bc66b9b7279da8f292a889f0acbffa) Thanks [@belgattitude](https://github.com/belgattitude)! - Ensure CI tests on Clouflare workers and latest chrome (playwright)

## 1.1.2

### Patch Changes

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal refactor based on linter updates

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal refactor to simplify cache conditions

## 1.1.1

### Patch Changes

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add git url prefix in package.json

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove unecessary default condition from exports

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add publint after arethetypeswrong checks

## 1.1.0

### Minor Changes

- [#1275](https://github.com/belgattitude/httpx/pull/1275) [`bd35900`](https://github.com/belgattitude/httpx/commit/bd35900b4a57c27f0aa15dd32cd833fcadff23ed) Thanks [@belgattitude](https://github.com/belgattitude)! - Add MIntl.cache to get stats or clear the lru

## 1.0.0

### Major Changes

- [#1255](https://github.com/belgattitude/httpx/pull/1255) [`a37e9e9`](https://github.com/belgattitude/httpx/commit/a37e9e9335cb6288c0abc72634591ac8d2e654cf) Thanks [@belgattitude](https://github.com/belgattitude)! - Add support for Intl.DateTimeFormatter

## 0.2.0

### Minor Changes

- [#1253](https://github.com/belgattitude/httpx/pull/1253) [`fe460a9`](https://github.com/belgattitude/httpx/commit/fe460a95838470c8439d0e39fe74e38be8fb7c90) Thanks [@belgattitude](https://github.com/belgattitude)! - Add LRU to limit the number of cached instances (50 by default)

## 0.1.0

### Minor Changes

- [#1251](https://github.com/belgattitude/httpx/pull/1251) [`a921f6a`](https://github.com/belgattitude/httpx/commit/a921f6aadd70009de8e491c1a98efeb8c6338ecb) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve performance and bundle size

## 0.0.2

### Patch Changes

- [#1246](https://github.com/belgattitude/httpx/pull/1246) [`8bbf027`](https://github.com/belgattitude/httpx/commit/8bbf02771150329e7d50fea2ac8755ab54dc6ecb) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial @httpx/memo-intl utility
