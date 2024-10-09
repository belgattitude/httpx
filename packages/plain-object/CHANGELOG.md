# @httpx/plain-object

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
