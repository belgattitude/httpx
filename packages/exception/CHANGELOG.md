# @httpx/exception

## 1.8.0

### Minor Changes

- [#402](https://github.com/belgattitude/httpx/pull/402) [`6b945d3`](https://github.com/belgattitude/httpx/commit/6b945d3c32198199bb0fdc3adae097e3d056c5cc) Thanks [@belgattitude](https://github.com/belgattitude)! - Add field error validation support for 422 HttpUnprocessableEntity

  Example:

  ```typescript
  import { HttpUnprocessableEntity } from '@httpx/exception';

  const e422 = new HttpUnprocessableEntity({
    errors: [
      {
        message: 'Invalid email',
        path: 'email',
        code: 'invalid_email',
      },
      {
        message: 'Invalid address',
        path: ['addresses', 0, 'line1'],
        code: 'empty_string',
      },
    ],
  });

  console.log(e422.errors);
  ```

### Patch Changes

- [#404](https://github.com/belgattitude/httpx/pull/404) [`f4c2780`](https://github.com/belgattitude/httpx/commit/f4c2780b694aaca96dee7730df47e9e70e39cd6b) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix cyclic type import and use latest rollup to build

## 1.7.2

### Patch Changes

- [#309](https://github.com/belgattitude/httpx/pull/309) [`67321bc`](https://github.com/belgattitude/httpx/commit/67321bc51e1937f5159daee99567ee9c530eabb2) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix missing serializer export for commonjs (esm worked)

## 1.7.1

### Patch Changes

- [#143](https://github.com/belgattitude/httpx/pull/143) [`7ccae63`](https://github.com/belgattitude/httpx/commit/7ccae636ebabd1ca16b519a3965e8e61d9faa16a) Thanks [@belgattitude](https://github.com/belgattitude)! - No changes, just the build with latest rollup/babel

## 1.7.0

### Minor Changes

- [#31](https://github.com/belgattitude/httpx/pull/31) [`167c216`](https://github.com/belgattitude/httpx/commit/167c216e7c5d6a209e17b17fa4ddb6db584bacd3) Thanks [@belgattitude](https://github.com/belgattitude)! - Support ValidationError in HttpBadRequest

  In some circumstances you might find useful to append the validation errors to
  `HttpBadRequest`. Here's a quick example:

  ```typescript
  const e400 = new HttpBadRequest({
    errors: [
      {
        message: 'Invalid email',
        path: 'email',
        code: 'invalid_email',
      },
      {
        message: 'Invalid address',
        path: ['addresses', 0, 'line1'],
        code: 'empty_string',
      },
    ],
  });
  console.log(e400.errors);
  ```

## 1.6.2

### Patch Changes

- [#28](https://github.com/belgattitude/httpx/pull/28) [`3ddb181`](https://github.com/belgattitude/httpx/commit/3ddb181783b6e3822005172070a0e3d1219c141b) Thanks [@belgattitude](https://github.com/belgattitude)! - Increase legacy browsers usage (+ include latest babel upstream fixes)

## 1.6.1

### Patch Changes

- [#14](https://github.com/belgattitude/httpx/pull/14) [`be9dd3f`](https://github.com/belgattitude/httpx/commit/be9dd3f7fdc19f2c60616d3313b9a6c1084d5a5a) Thanks [@belgattitude](https://github.com/belgattitude)! - Missing npm description field

## 1.6.0

### Minor Changes

- [#10](https://github.com/belgattitude/httpx/pull/10) [`6f94a9f`](https://github.com/belgattitude/httpx/commit/6f94a9f7c40490127f6b5166318a7882869b19d8) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix release

## 1.5.0

### Minor Changes

- [#5](https://github.com/belgattitude/httpx/pull/5) [`b51c863`](https://github.com/belgattitude/httpx/commit/b51c8634021b4226792e417433c50359283aed9e) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename package to @httpx/exception

  The `@belgattitude/http-exception` package have been renamed to `@httpx/exception`.

## 1.4.0

> Before v1.5.0 the `@httpx/exception` package was named `@belgattitude/http-exception
> and lived in https://github.com/begattitude/http-exception repository.

### Minor Changes

- [#141](https://github.com/belgattitude/http-exception/pull/141) [`57574ed`](https://github.com/belgattitude/http-exception/commit/57574ed858cdb207812e2035778a30c726d5a458) Thanks [@belgattitude](https://github.com/belgattitude)! - Upgrapde to rollup v3

## 1.3.4

### Patch Changes

- [#118](https://github.com/belgattitude/http-exception/pull/118) [`2bea0d6`](https://github.com/belgattitude/http-exception/commit/2bea0d630a5629ebbde12165f59dd48208e01c6f) Thanks [@belgattitude](https://github.com/belgattitude)! - Bundle with rollup v3.0.0

## 1.3.3

### Patch Changes

- [#96](https://github.com/belgattitude/http-exception/pull/96) [`5b964fd`](https://github.com/belgattitude/http-exception/commit/5b964fde6165254596d955e559bacf0eb0d1112d) Thanks [@belgattitude](https://github.com/belgattitude)! - Disable minification to allow patching (patch-package...)

## 1.3.2

### Patch Changes

- [#91](https://github.com/belgattitude/http-exception/pull/91) [`9498cb2`](https://github.com/belgattitude/http-exception/commit/9498cb269dbcf2fd43946209198fda16684be3db) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove hardcoded string in supportsCause function

## 1.3.1

### Patch Changes

- [#87](https://github.com/belgattitude/http-exception/pull/87) [`a8fbdd2`](https://github.com/belgattitude/http-exception/commit/a8fbdd26842243b87096c209994afc317d1f9810) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix potential issue with cause that could be undefined

## 1.3.0

### Minor Changes

- [#75](https://github.com/belgattitude/http-exception/pull/75) [`89d2dd8`](https://github.com/belgattitude/http-exception/commit/89d2dd85531122eaa39ec531a5b4f2aa36f8dff2) Thanks [@belgattitude](https://github.com/belgattitude)! - Added `method`, `code` and `errorId` params.

  | Name    | Type      | Description                                   |
  | ------- | --------- | --------------------------------------------- |
  | url     | `string?` | url on which the error happened               |
  | method  | `string?` | http method used to load the url              |
  | code    | `string?` | Custom code (ie: 'AbortError', 'E-1234'...)   |
  | errorId | `string?` | Unique error identifier (ie: uuid, nanoid...) |

  ```typescript
  const err = new HttpRequestTimeout({
    url: 'https://api.dev/user/belgattitude',
    method: 'GET',
    code: 'NETWORK_FAILURE',
    errorId: nanoid(), // can be shared by frontend/backend
  });
  console.log(err.url, err.method, err.code, err.errorId);
  ```

### Patch Changes

- [#71](https://github.com/belgattitude/http-exception/pull/71) [`f3c423f`](https://github.com/belgattitude/http-exception/commit/f3c423f24ab9bad8c51510e20b941597fff6acc2) Thanks [@belgattitude](https://github.com/belgattitude)! - Improved documenation and website live

## 1.2.0

### Minor Changes

- [#67](https://github.com/belgattitude/http-exception/pull/67) [`7208e7b`](https://github.com/belgattitude/http-exception/commit/7208e7bafc06f5db02902bcdd83233b9d4d4d854) Thanks [@belgattitude](https://github.com/belgattitude)! - Export convertToSerializable and createFromSerializable

  ```typescript
  import {
    convertToSerializable,
    createFromSerializable,
  } from '@httpx/exception/serializer';

  const serializableObject = convertToSerializable(new HttpForbidden());
  const exception = createFromSerializable(serializableObject);
  ```

### Patch Changes

- [#56](https://github.com/belgattitude/http-exception/pull/56) [`bddd84a`](https://github.com/belgattitude/http-exception/commit/bddd84a00d07d1c9619d4a929e6da52f51bf7208) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial documentation and updated examples

## 1.1.0

### Minor Changes

- [#33](https://github.com/belgattitude/http-exception/pull/33) [`67be0fb`](https://github.com/belgattitude/http-exception/commit/67be0fbbb1acafa2c12a8c5a45b30f8b79ad3c4c) Thanks [@belgattitude](https://github.com/belgattitude)! - Add HttpException json serializer.

  Two new methods `fromJson` and `toJson` exported from `@httpx/exception/serializer`.

  HttpException can be serialized to json and vice-versa. It can be useful in ssr frameworks such as
  [nextjs](https://nextjs.org/) whenever a server error should be shared within the browser context (see also
  the excellent [superjson](https://github.com/blitz-js/superjson#recipes)).

  Serialization supports the [Error.cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
  but totally ignores it the runtime (node or browser) does not support it (or without polyfills).

  Additionally, you can pass any native errors (`Error`, `EvalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, `URIError`)
  as well as a custom one (the later will be transformed to the base type Error). That was necessary to support the cause param.

  | Method                                                              |
  | ------------------------------------------------------------------- |
  | **toJson**(HttpException &#124; NativeError &#124; Error): string   |
  | **fromJson**(string): HttpException &#124; NativeError &#124; Error |

  ```typescript
  import {
    HttpForbidden,
    HttpUnavailableForLegalReasons,
  } from '@httpx/exception';
  import { fromJson, toJson } from '@httpx/exception/serializer';

  const e = new HttpForbidden({
    url: 'https://www.cool.me',
    /*
      cause: new HttpUnavailableForLegalReasons({
          cause: new Error('example with cause')
      }),
       */
  });

  const json = toJson(e);
  const exception = fromJson(json); // e === exception
  ```

## 1.0.2

### Patch Changes

- [#51](https://github.com/belgattitude/http-exception/pull/51) [`421b36d`](https://github.com/belgattitude/http-exception/commit/421b36d949f06aa43daa9b3d77da2429a6bb5e1e) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix `Error.cause` on node < 16.9 and browsers that don't support for it.

  - **Browser** currently 89% support: [caniuse#error.cause](https://caniuse.com/mdn-javascript_builtins_error_error_options_cause_parameter) - (89% supports it as of sept 2022)
  - **Node** from 16.9.0 as per [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#browser_compatibility).

  The strategy used can be summarized as:

  > If the browser or the node runtime does not support Error.cause parameter in the
  > constructor, it will simply be discarded.
  > ie:
  >
  > ```
  > const err = new HttpNotFound({cause: new Error()});
  > console.log(err.cause) -> undefined if no support
  > console.log(err.cause) -> Error cause if supported
  > ```

  To enable older browser or previous node versions, there's 2 polyfills that should
  do the job

  - [error-cause-polyfill](https://github.com/ehmicky/error-cause-polyfill)
  - [error-cause](https://github.com/es-shims/error-cause)

## 1.0.1

### Patch Changes

- [#40](https://github.com/belgattitude/http-exception/pull/40) [`d1ed899`](https://github.com/belgattitude/http-exception/commit/d1ed89948229de00ca3e119365269a1850fbf575) Thanks [@belgattitude](https://github.com/belgattitude)! - Support for older browser (class / spread transform)

## 1.0.0

### Major Changes

- [#31](https://github.com/belgattitude/http-exception/pull/31) [`662db5f`](https://github.com/belgattitude/http-exception/commit/662db5f34c81527593e4ebc748fc1c144362f9c9) Thanks [@belgattitude](https://github.com/belgattitude)! - Coverage at 100% and last fixes

### Patch Changes

- [#28](https://github.com/belgattitude/http-exception/pull/28) [`c76dd69`](https://github.com/belgattitude/http-exception/commit/c76dd69b8aea2436304737e2bcfa23aaa4dd6a27) Thanks [@belgattitude](https://github.com/belgattitude)! - Squeeze out 450 bytes for full import

- [#25](https://github.com/belgattitude/http-exception/pull/25) [`c153ff8`](https://github.com/belgattitude/http-exception/commit/c153ff82d16851bdf2b39a5f2367515a0fffc305) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve build

## 0.1.10-canary.1

### Patch Changes

- [#28](https://github.com/belgattitude/http-exception/pull/28) [`c76dd69`](https://github.com/belgattitude/http-exception/commit/c76dd69b8aea2436304737e2bcfa23aaa4dd6a27) Thanks [@belgattitude](https://github.com/belgattitude)! - Squeeze out 450 bytes for full import

## 0.1.10-canary.0

### Patch Changes

- [#25](https://github.com/belgattitude/http-exception/pull/25) [`c153ff8`](https://github.com/belgattitude/http-exception/commit/c153ff82d16851bdf2b39a5f2367515a0fffc305) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve build

## 0.1.9

### Patch Changes

- [#18](https://github.com/belgattitude/http-exception/pull/18) [`6a81535`](https://github.com/belgattitude/http-exception/commit/6a81535f70d0c7635c8a1539db94c8409b4ce083) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve tree-shaking

- [#20](https://github.com/belgattitude/http-exception/pull/20) [`633b1e0`](https://github.com/belgattitude/http-exception/commit/633b1e0f925c6cfcf7dc48e21132fcede103c0db) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve tree-shaking commonjs

## 0.1.9-canary.1

### Patch Changes

- [#20](https://github.com/belgattitude/http-exception/pull/20) [`633b1e0`](https://github.com/belgattitude/http-exception/commit/633b1e0f925c6cfcf7dc48e21132fcede103c0db) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve tree-shaking commonjs

## 0.1.9-canary.0

### Patch Changes

- [#18](https://github.com/belgattitude/http-exception/pull/18) [`6a81535`](https://github.com/belgattitude/http-exception/commit/6a81535f70d0c7635c8a1539db94c8409b4ce083) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve tree-shaking

## 0.1.8

### Patch Changes

- [#16](https://github.com/belgattitude/http-exception/pull/16) [`cdf3333`](https://github.com/belgattitude/http-exception/commit/cdf3333887c480c01c638714bd49843d8d30e385) Thanks [@belgattitude](https://github.com/belgattitude)! - Add sourcemaps to published dist

## 0.1.7

### Patch Changes

- [#14](https://github.com/belgattitude/http-exception/pull/14) [`3fe82d8`](https://github.com/belgattitude/http-exception/commit/3fe82d8ce626ba693f0079a9523194ba78b2a437) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal package in cjs to help dual packaging

## 0.1.6

### Patch Changes

- [`76f7fea`](https://github.com/belgattitude/http-exception/commit/76f7feaaa1f5eaf3f728ead69055c8b882b6ff54) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove browser field

## 0.1.5

### Patch Changes

- [#11](https://github.com/belgattitude/http-exception/pull/11) [`6168b27`](https://github.com/belgattitude/http-exception/commit/6168b279201255281afd2b3e5e9863368c670ea5) Thanks [@belgattitude](https://github.com/belgattitude)! - Publish with browser field

## 0.1.4

### Patch Changes

- [`281a688`](https://github.com/belgattitude/http-exception/commit/281a688450f58546cdf429e5e33e312e791f0db0) Thanks [@belgattitude](https://github.com/belgattitude)! - Re-publish with module to test bundlephobia

## 0.1.3

### Patch Changes

- [`1b493ad`](https://github.com/belgattitude/http-exception/commit/1b493add604758e455d72b9a1b94c991ed67b651) Thanks [@belgattitude](https://github.com/belgattitude)! - Rework publishing

## 0.1.2

### Patch Changes

- [#6](https://github.com/belgattitude/http-exception/pull/6) [`0be9b73`](https://github.com/belgattitude/http-exception/commit/0be9b73c8f6641cf26c1356726c46d2b81be31bd) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve publication and examples

## 0.1.1

### Patch Changes

- [#4](https://github.com/belgattitude/http-exception/pull/4) [`06204b2`](https://github.com/belgattitude/http-exception/commit/06204b20b9b06d2924d618f2d241ed68eac87931) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix publication
