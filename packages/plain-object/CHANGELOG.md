# @httpx/plain-object

## 2.1.3

### Patch Changes

- [`cc363ff`](https://github.com/belgattitude/httpx/commit/cc363ff36a48aece196423ee61f59a3c6cee48db) Thanks [@belgattitude](https://github.com/belgattitude)! - No code change, maintenance release to rebuild with latest esbuild.

## 2.1.2

### Patch Changes

- [#2463](https://github.com/belgattitude/httpx/pull/2463) [`1a75006`](https://github.com/belgattitude/httpx/commit/1a75006e9a544360299320ce84ca5ce5e68caf22) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.25.9 (no code change)

## 2.1.1

### Patch Changes

- [#2418](https://github.com/belgattitude/httpx/pull/2418) [`6915894`](https://github.com/belgattitude/httpx/commit/691589482047c4ffb48a3e66c5d4a18a15b4d0d2) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.28.8

## 2.1.0

### Minor Changes

- [#2371](https://github.com/belgattitude/httpx/pull/2371) [`8bc68fd`](https://github.com/belgattitude/httpx/commit/8bc68fd67eac8f1335ee61907562399818e23b3b) Thanks [@belgattitude](https://github.com/belgattitude)! - Drop node 18.x, require node 20.x, add node 24.x to CI

## 2.0.9

### Patch Changes

- [#2290](https://github.com/belgattitude/httpx/pull/2290) [`a795daa`](https://github.com/belgattitude/httpx/commit/a795daa611f33942410777ddf7f561cf5e122028) Thanks [@belgattitude](https://github.com/belgattitude)! - Update esbuild to 0.25.5

## 2.0.8

### Patch Changes

- [#2243](https://github.com/belgattitude/httpx/pull/2243) [`54a79d9`](https://github.com/belgattitude/httpx/commit/54a79d9c530da590f634011ece54e83755ca6d6a) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with tsup 8.5.0, includes a fix for cjs in certain usages

## 2.0.7

### Patch Changes

- [#2226](https://github.com/belgattitude/httpx/pull/2226) [`8548046`](https://github.com/belgattitude/httpx/commit/8548046e58bed76f2e54c709acf92817316783a4) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest tsup, esbuild 0.25.4

## 2.0.6

### Patch Changes

- [#1872](https://github.com/belgattitude/httpx/pull/1872) [`6b5c38e`](https://github.com/belgattitude/httpx/commit/6b5c38eda03d541c62a1cdf9ba298be5b75087e1) Thanks [@belgattitude](https://github.com/belgattitude)! - Updated browserslist baseline for 2025

  For most users there won't be any change.
  Still around 95% on [browserslist](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D).

  ```
  defaults
  chrome >= 96
  firefox >= 105
  edge >= 113
  safari >= 15
  ios >= 15
  opera >= 103
  not dead
  ```

## 2.0.5

### Patch Changes

- [#1849](https://github.com/belgattitude/httpx/pull/1849) [`f6e8044`](https://github.com/belgattitude/httpx/commit/f6e80441c4c231aa3c754a19dfb2ef740f10876b) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix invalid jsdoc in `isPlainObject`.

- [#1849](https://github.com/belgattitude/httpx/pull/1849) [`f6e8044`](https://github.com/belgattitude/httpx/commit/f6e80441c4c231aa3c754a19dfb2ef740f10876b) Thanks [@belgattitude](https://github.com/belgattitude)! - Update benchmarks in readme

## 2.0.4

### Patch Changes

- [#1791](https://github.com/belgattitude/httpx/pull/1791) [`946f440`](https://github.com/belgattitude/httpx/commit/946f4400576ccc72f1b3c9fa140e84ea82e0e997) Thanks [@belgattitude](https://github.com/belgattitude)! - Update comparative benchmarks with latest versions.

  ```
  RUN  v2.1.8

   ✓ bench/comparative.bench.ts (7) 5774ms
     ✓ Compare calling isPlainObject with 110x mixed types values (7) 5773ms
       name                                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
     · "@httpx/plain-object": `isPlainObject(v)`        1,395,419.02  0.0006  1.8273  0.0007  0.0007  0.0012  0.0013  0.0022  ±1.01%   697710   fastest
     · "is-plain-obj":"4.1.0": 'isPlainObj(v)'          1,308,696.50  0.0006  1.0286  0.0008  0.0007  0.0013  0.0013  0.0022  ±0.71%   654349
     · "@sindresorhus/is":"7.0.1": 'is.plainObject(v)'    780,257.18  0.0011  0.9150  0.0013  0.0012  0.0024  0.0025  0.0073  ±0.56%   390129
     · "es-toolkit":"1.31.0": 'isPlainObject(v)'        1,077,076.98  0.0007  2.5125  0.0009  0.0008  0.0016  0.0017  0.0118  ±1.46%   538539
     · "redux":"5.0.1": 'isPlainObject(v)'                473,750.80  0.0017  0.9967  0.0021  0.0019  0.0034  0.0038  0.0197  ±0.70%   236878
     · "is-plain-object":"5.0.0": 'isPlainObject(v)'      569,808.67  0.0014  2.0280  0.0018  0.0016  0.0031  0.0033  0.0199  ±1.25%   284905
     · lodash-es:"4.17.21": '_.isPlainObject(v)'           19,551.73  0.0452  1.2833  0.0511  0.0473  0.1073  0.1498  0.3331  ±0.96%     9776   slowest

   BENCH  Summary

    "@httpx/plain-object": `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
      1.07x faster than "is-plain-obj":"4.1.0": 'isPlainObj(v)'
      1.30x faster than "es-toolkit":"1.31.0": 'isPlainObject(v)'
      1.79x faster than "@sindresorhus/is":"7.0.1": 'is.plainObject(v)'
      2.45x faster than "is-plain-object":"5.0.0": 'isPlainObject(v)'
      2.95x faster than "redux":"5.0.1": 'isPlainObject(v)'
      71.37x faster than lodash-es:"4.17.21": '_.isPlainObject(v)'
  ```

## 2.0.3

### Patch Changes

- [#1661](https://github.com/belgattitude/httpx/pull/1661) [`be1dbb3`](https://github.com/belgattitude/httpx/commit/be1dbb30bca671124f91de5714aadfc0a46789a0) Thanks [@belgattitude](https://github.com/belgattitude)! - Tiny size reduction

## 2.0.2

### Patch Changes

- [#1546](https://github.com/belgattitude/httpx/pull/1546) [`bdf9e19`](https://github.com/belgattitude/httpx/commit/bdf9e19d11bc66b9b7279da8f292a889f0acbffa) Thanks [@belgattitude](https://github.com/belgattitude)! - Ensure CI tests on Clouflare workers and latest chrome (playwright)

## 2.0.1

### Patch Changes

- [#1535](https://github.com/belgattitude/httpx/pull/1535) [`d1a01e2`](https://github.com/belgattitude/httpx/commit/d1a01e2af290f9f5bc0f2357773616b39a9e048d) Thanks [@belgattitude](https://github.com/belgattitude)! - Mention comparison with redux isPlainObject (100% compat)

## 2.0.0

### Major Changes

- [#1530](https://github.com/belgattitude/httpx/pull/1530) [`4e1ecf4`](https://github.com/belgattitude/httpx/commit/4e1ecf4088664896e0d43ee765efa6f6b270054b) Thanks [@belgattitude](https://github.com/belgattitude)! - Not 100% compatible with sindreshorsus/is-plain-obj anymore

  The changes shouldn't affect most users, but it's worth noting that the `isPlainObject`
  function no longer consider static built-in objects as plain objects (Math, JSON, Atomics).

  This fix an issue with `{ [Symbol.toStringTag]: 'tag' }` that wasn't considered as a plain object.

  If the behaviour is needed there's a new `isStaticBuiltInClass` function that can be used to check
  if a value is a static built-in class (Math, JSON, Atomics).

  Another change to mention is that `isPlainObject` now accepts `[Symbol.iterator]`
  as a valid property for plain objects.

  ```typescript
  const v = {
    [Symbol.iterator]: function* () {
      yield 1;
    },
  }; // Since v2 considered as a plain object
  ```

  Which allows to add iterators to plain objects.

- [#1530](https://github.com/belgattitude/httpx/pull/1530) [`4e1ecf4`](https://github.com/belgattitude/httpx/commit/4e1ecf4088664896e0d43ee765efa6f6b270054b) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix issue with plain objects that contains a [Symbol.iterator]

  `isPlainObject` now accepts `[Symbol.iterator]` as a valid property for plain objects.

  ```typescript
  const v = {
    [Symbol.iterator]: function* () {
      yield 1;
    },
  }; // Since v2 considered as a plain object
  ```

  Which allows to add iterators to plain objects.

- [#1530](https://github.com/belgattitude/httpx/pull/1530) [`4e1ecf4`](https://github.com/belgattitude/httpx/commit/4e1ecf4088664896e0d43ee765efa6f6b270054b) Thanks [@belgattitude](https://github.com/belgattitude)! - Small performance increase

  ```
  @httpx/plain-object: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
   1.11x faster than (sindresorhus/)is-plain-obj: `isPlainObj(v)`
   1.79x faster than @sindresorhus/is: `is.plainObject(v)`
   2.29x faster than (jonschlinkert/)is-plain-object: `isPlainObject(v)`
   14.66x faster than estoolkit:  `isPlainObject(v)`
   73.82x faster than lodash-es: `_.isPlainObject(v)`
  ```

- [#1530](https://github.com/belgattitude/httpx/pull/1530) [`4e1ecf4`](https://github.com/belgattitude/httpx/commit/4e1ecf4088664896e0d43ee765efa6f6b270054b) Thanks [@belgattitude](https://github.com/belgattitude)! - This fix an issue with `{ [Symbol.toStringTag]: 'tag' }` that wasn't considered as a plain object.

- [#1530](https://github.com/belgattitude/httpx/pull/1530) [`4e1ecf4`](https://github.com/belgattitude/httpx/commit/4e1ecf4088664896e0d43ee765efa6f6b270054b) Thanks [@belgattitude](https://github.com/belgattitude)! - Bundle size reduction from 101B to 75B when importing isPlainObject from @httpx/plain-object

  ```
    Only { isPlainObject } (ESM)
    Package size is 1 B less than limit
    Size limit: 76 B
    Size:       75 B with all dependencies, minified and brotlied

    Only { assertPlainObject } (ESM)
    Package size is 1 B less than limit
    Size limit: 133 B
    Size:       132 B with all dependencies, minified and brotlied

    Import { assertPlainObject, isPlainObject } (ESM)
    Size:       139 B with all dependencies, minified and brotlied
  ```

- [#1530](https://github.com/belgattitude/httpx/pull/1530) [`4e1ecf4`](https://github.com/belgattitude/httpx/commit/4e1ecf4088664896e0d43ee765efa6f6b270054b) Thanks [@belgattitude](https://github.com/belgattitude)! - isPlainObject allows static built-in classes: for Atomic, Math, Json.

  The changes shouldn't affect most users, but it's worth noting that the `isPlainObject`
  function no longer consider static build-in objects as plain objects (Math, JSON, Atomics).

  This fix an issue with `{ [Symbol.toStringTag]: 'tag' }` that wasn't considered as a plain object.

  If the behaviour is needed there's a new `isStaticBuiltInClass` function that can be used to check
  if a value is a static built-in class (Math, JSON, Atomics).

  ```typescript
  import { isPlainObject, isStaticBuiltInClass } from "@httpx/plain-object";
  const v = Math; // or Atomics or JSON
  if (isPlainObject(v) && !isStaticBuiltInClass(v)) {
    console.log("v is a plain object but not a static built-in class");
  }
  ```

- [#1530](https://github.com/belgattitude/httpx/pull/1530) [`4e1ecf4`](https://github.com/belgattitude/httpx/commit/4e1ecf4088664896e0d43ee765efa6f6b270054b) Thanks [@belgattitude](https://github.com/belgattitude)! - Change assertPlainObject default message to 'Not a PlainObject'

  This change the default error message of `assertPlainObject` to 'Not a PlainObject' instead of 'Not a plain object'.

## 1.2.0

### Minor Changes

- [#1523](https://github.com/belgattitude/httpx/pull/1523) [`003cdb3`](https://github.com/belgattitude/httpx/commit/003cdb3f4e0ff00970ac00b56659a47a30f7358f) Thanks [@belgattitude](https://github.com/belgattitude)! - Small speedup for isPlainObject and size reduction

## 1.1.3

### Patch Changes

- [#1434](https://github.com/belgattitude/httpx/pull/1434) [`6bd5105`](https://github.com/belgattitude/httpx/commit/6bd5105190e290b84417a8b8fe535b3a3df9816b) Thanks [@belgattitude](https://github.com/belgattitude)! - internal: assertPlainObject error message remove explicit undefined union

## 1.1.2

### Patch Changes

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal refactor based on linter updates

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix duplicate imports for assertPlainObject

## 1.1.1

### Patch Changes

- [#1371](https://github.com/belgattitude/httpx/pull/1371) [`bda9fa3`](https://github.com/belgattitude/httpx/commit/bda9fa3f5b759a6a09a1a9f5d37e2792b456368b) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix readme links

## 1.1.0

### Minor Changes

- [`cb95198`](https://github.com/belgattitude/httpx/commit/cb9519808aff0b63ca2daaec1655bd4cdcab9f2f) Thanks [@belgattitude](https://github.com/belgattitude)! - Convert some type unions to interfaces to increase typechecking perf

- [`cb95198`](https://github.com/belgattitude/httpx/commit/cb9519808aff0b63ca2daaec1655bd4cdcab9f2f) Thanks [@belgattitude](https://github.com/belgattitude)! - Add perf comparison with es-toolkit

### Patch Changes

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add git url prefix in package.json

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove unecessary default condition from exports

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add publint after arethetypeswrong checks

## 1.0.0

### Major Changes

- [#1334](https://github.com/belgattitude/httpx/pull/1334) [`e6a373c`](https://github.com/belgattitude/httpx/commit/e6a373cafd6bc8535d6f595630c1256bc4fa373c) Thanks [@belgattitude](https://github.com/belgattitude)! - Promote @httpx/plain-object to stable v1

## 0.1.0

### Minor Changes

- [#1315](https://github.com/belgattitude/httpx/pull/1315) [`a1db7d3`](https://github.com/belgattitude/httpx/commit/a1db7d3676352f7834c74b1b4cc8006a2210cb4f) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial release of @httpx/plain-object
