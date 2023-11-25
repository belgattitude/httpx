# @httpx/exception

## 2.5.3

### Patch Changes

- [#724](https://github.com/belgattitude/httpx/pull/724) [`8d02a2a`](https://github.com/belgattitude/httpx/commit/8d02a2a516aaf42ff5e002889938c6282c862b47) Thanks [@belgattitude](https://github.com/belgattitude)! - Optimize code thanks to eslint unicorn plugin

## 2.5.2

### Patch Changes

- [#719](https://github.com/belgattitude/httpx/pull/719) [`bae6ce0`](https://github.com/belgattitude/httpx/commit/bae6ce05a85822b0ec4658b679e82ce4efa9222f) Thanks [@belgattitude](https://github.com/belgattitude)! - Upgrade tsup to 7.3 and build with esbuild 0.19.3

## 2.5.1

### Patch Changes

- [#677](https://github.com/belgattitude/httpx/pull/677) [`92343d2`](https://github.com/belgattitude/httpx/commit/92343d2ef30678cfdb0edd29b8fc2a492b91ec58) Thanks [@belgattitude](https://github.com/belgattitude)! - Add tupleson tests and improve docs

## 2.5.0

### Minor Changes

- [#675](https://github.com/belgattitude/httpx/pull/675) [`a6a63e1`](https://github.com/belgattitude/httpx/commit/a6a63e174af87f04eaf105a6e45c2ef56fc64ade) Thanks [@belgattitude](https://github.com/belgattitude)! - Add support for HttpUnprocessableEntity.issues in serializer.

  ```typescript
  import { fromJson, toJson } from "@httpx/exception/serializer";

  const e422 = new HttpUnprocessableEntity({
    message: "Validation failed",
    issues: [
      {
        message: "Invalid address",
        path: ["addresses", 0, "line1"],
        code: "empty_string",
      },
    ],
  });

  const json = toJson(e422);
  const js = fromJson(json);

  expect((js as HttpUnprocessableEntity).issues).toStrictEqual(e422.issues);
  expect(js).toStrictEqual(e422);
  ```

### Patch Changes

- [#675](https://github.com/belgattitude/httpx/pull/675) [`a6a63e1`](https://github.com/belgattitude/httpx/commit/a6a63e174af87f04eaf105a6e45c2ef56fc64ade) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix createHttpException that wasn't allowing issues on HttpUnprocessableEntity

  ```typescript
  const e422 = createHttpException(422, {
    message: "Validation failed",
    issues: [
      {
        message: "Invalid address",
        path: ["addresses", 0, "line1"],
        code: "empty_string",
      },
    ],
  });
  ```

## 2.4.0

### Minor Changes

- [#672](https://github.com/belgattitude/httpx/pull/672) [`9d1d248`](https://github.com/belgattitude/httpx/commit/9d1d2484828906559f192ab337b645032c257518) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce bundle size by using class names rather than strings

  Importing all exceptions (excluding utilities, typeguards...) now top at 1Kb

  Example based on ESM (min+gzip)

  | Scenario                    | Size   |
  | --------------------------- | ------ |
  | one exception               | ~ 450b |
  | all exceptions              | < 1kb  |
  | everything (typeguards,...) | 1.7kb  |

## 2.3.0

### Minor Changes

- [#667](https://github.com/belgattitude/httpx/pull/667) [`6872abb`](https://github.com/belgattitude/httpx/commit/6872abbc7d51eca4eae85e66fadef334ef16763d) Thanks [@belgattitude](https://github.com/belgattitude)! - Minimum node version is 18.12. Move to es2022.

- [#667](https://github.com/belgattitude/httpx/pull/667) [`6872abb`](https://github.com/belgattitude/httpx/commit/6872abbc7d51eca4eae85e66fadef334ef16763d) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce drastically bundle size (use es2022)

  Importing a single exception starts at 377 bytes, subsequent ones will add less than 50 bytes in average.
  Importing all exceptions (excluding typeguards...) will top at 1400 bytes.

  Code should be faster too.

  > PS: if you use exceptions outside of nodejs and need to support legacy browsers
  > a lot of frameworks allows to transpile modules (ie nextjs).

  ```
  ✔ Adding to empty webpack project

    ESM (import everything *)
    Package size is 395 B less than limit
    Size limit: 2.46 kB
    Size:       2.06 kB with all dependencies, minified and gzipped

    ESM (only HttpNotFound exception)
    Package size is 965 B less than limit
    Size limit: 1.42 kB
    Size:       450 B   with all dependencies, minified and gzipped

    ESM (two exceptions: HttpNotFound + HttpInternalServerError)
    Package size is 935 B less than limit
    Size limit: 1.44 kB
    Size:       505 B   with all dependencies, minified and gzipped

    ESM (only isHttpException)
    Package size is 1.03 kB less than limit
    Size limit: 1.41 kB
    Size:       377 B   with all dependencies, minified and gzipped

    ESM (only createHttpException)
    Package size is 571 B less than limit
    Size limit: 2 kB
    Size:       1.43 kB with all dependencies, minified and gzipped

    ESM ({ toJson })
    Package size is 1.11 kB less than limit
    Size limit: 1.89 kB
    Size:       779 B   with all dependencies, minified and gzipped

    ESM ({ fromJson })
    Package size is 607 B less than limit
    Size limit: 2.5 kB
    Size:       1.89 kB with all dependencies, minified and gzipped

    CJS (require everything *)
    Package size is 416 B less than limit
    Size limit: 3.05 kB
    Size:       2.63 kB with all dependencies, minified and gzipped

    CJS (only isHttpException)
    Package size is 598 B less than limit
    Size limit: 2.5 kB
    Size:       1.9 kB with all dependencies, minified and gzipped

  ```

## 2.2.0

### Minor Changes

- [`81311de`](https://github.com/belgattitude/httpx/commit/81311de622f84fadc381394f840318cbd542a68e) Thanks [@belgattitude](https://github.com/belgattitude)! - Deprecate ValidationError type in favour of HttpValidationIssue

  ```typescript
  // @deprecated errors
  // const errors: ValidationError[] = [

  // becomes
  const issues: HttpValidationIssue[] = [
    {
      message: "Invalid email",
      path: "email",
      code: "invalid_email",
    },
    {
      message: "Invalid address",
      path: ["addresses", 0, "line1"],
      code: "empty_string",
    },
  ];

  const e422 = new HttpUnprocessableEntity({
    // @deprecated name
    // errors: errors,

    // becomes issues
    issues: [],
  });
  ```

## 2.1.1

### Patch Changes

- [#589](https://github.com/belgattitude/httpx/pull/589) [`6eab016`](https://github.com/belgattitude/httpx/commit/6eab0169ccb0049da158fd9e24a645011a84e275) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix serializer type export for older projects

## 2.1.0

### Minor Changes

- [#532](https://github.com/belgattitude/httpx/pull/532) [`cfe1808`](https://github.com/belgattitude/httpx/commit/cfe180848a01e94ff475c2d27bdf1c9d3c007a2f) Thanks [@belgattitude](https://github.com/belgattitude)! - Lint with typescript/eslint v6 strict

## 2.0.0

### Major Changes

- [#512](https://github.com/belgattitude/httpx/pull/512) [`58ea021`](https://github.com/belgattitude/httpx/commit/58ea021a8126622b1b37d1045c48d1fa45029753) Thanks [@belgattitude](https://github.com/belgattitude)! - Minimum to node 16.12 / es2018 and modern browsers (>1%)

  Possibly a breaking change for some users relying on older browsers.

### Minor Changes

- [#512](https://github.com/belgattitude/httpx/pull/512) [`58ea021`](https://github.com/belgattitude/httpx/commit/58ea021a8126622b1b37d1045c48d1fa45029753) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce global file size by transpiling for node 16 and modern browsers.

### Patch Changes

- [#512](https://github.com/belgattitude/httpx/pull/512) [`58ea021`](https://github.com/belgattitude/httpx/commit/58ea021a8126622b1b37d1045c48d1fa45029753) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix type exports in some circumstances (masquerading as esm)

## 1.8.3

### Patch Changes

- [#482](https://github.com/belgattitude/httpx/pull/482) [`5337e61`](https://github.com/belgattitude/httpx/commit/5337e6135a41497341c6a3b1653a9641508d4142) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve typecheck strictness

## 1.8.2

### Patch Changes

- [#467](https://github.com/belgattitude/httpx/pull/467) [`99d6881`](https://github.com/belgattitude/httpx/commit/99d68810d753cb1b724251e7c4dd35f0cd11ce93) Thanks [@belgattitude](https://github.com/belgattitude)! - Add syncpack to align package.json fields

- [#465](https://github.com/belgattitude/httpx/pull/465) [`245ed6b`](https://github.com/belgattitude/httpx/commit/245ed6b7bea0ce6d1f0a711614a4ef8480679ecb) Thanks [@belgattitude](https://github.com/belgattitude)! - Dev dependencies updated to latest

## 1.8.1

### Patch Changes

- [`42cdf63`](https://github.com/belgattitude/httpx/commit/42cdf637c3d95b85f29e003016f33ac5c554667a) Thanks [@belgattitude](https://github.com/belgattitude)! - Minor perf by extracting regexp into an hoisted var

## 1.8.0

### Minor Changes

- [#402](https://github.com/belgattitude/httpx/pull/402) [`6b945d3`](https://github.com/belgattitude/httpx/commit/6b945d3c32198199bb0fdc3adae097e3d056c5cc) Thanks [@belgattitude](https://github.com/belgattitude)! - Add field error validation support for 422 HttpUnprocessableEntity

  Example:

  ```typescript
  import { HttpUnprocessableEntity } from "@httpx/exception";

  const e422 = new HttpUnprocessableEntity({
    errors: [
      {
        message: "Invalid email",
        path: "email",
        code: "invalid_email",
      },
      {
        message: "Invalid address",
        path: ["addresses", 0, "line1"],
        code: "empty_string",
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
        message: "Invalid email",
        path: "email",
        code: "invalid_email",
      },
      {
        message: "Invalid address",
        path: ["addresses", 0, "line1"],
        code: "empty_string",
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
    url: "https://api.dev/user/belgattitude",
    method: "GET",
    code: "NETWORK_FAILURE",
    errorId: nanoid(), // can be shared by frontend/server
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
  } from "@httpx/exception/serializer";

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
  } from "@httpx/exception";
  import { fromJson, toJson } from "@httpx/exception/serializer";

  const e = new HttpForbidden({
    url: "https://www.cool.me",
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