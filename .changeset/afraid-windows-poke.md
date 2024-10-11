---
"@httpx/assert": minor
---

isPlainObject inline behaviour with @httpx/plain-object v2.

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
