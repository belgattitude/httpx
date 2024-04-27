# @httpx/exception

## 3.0.6

### Patch Changes

- [#1154](https://github.com/belgattitude/httpx/pull/1154) [`6a52be7`](https://github.com/belgattitude/httpx/commit/6a52be772efd39c8270f26993d718b180d726539) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild using esbuild 0.20.2

## 3.0.5

### Patch Changes

- [#990](https://github.com/belgattitude/httpx/pull/990) [`a006c93`](https://github.com/belgattitude/httpx/commit/a006c93fe9b34d09c642f68669028353b986b218) Thanks [@belgattitude](https://github.com/belgattitude)! - Minor refactors and readme updates

## 3.0.4

### Patch Changes

- [#971](https://github.com/belgattitude/httpx/pull/971) [`ab3767f`](https://github.com/belgattitude/httpx/commit/ab3767fb70810e6a9d36a6467c6acc2708008796) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix classname mangling

## 3.0.3

### Patch Changes

- [#916](https://github.com/belgattitude/httpx/pull/916) [`8ab0e1a`](https://github.com/belgattitude/httpx/commit/8ab0e1aa4d3fae9a897c89cd34c5cd386395c9ac) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix README documentation regarding helpers

## 3.0.2

### Patch Changes

- [`28687e1`](https://github.com/belgattitude/httpx/commit/28687e16e42019d3d9f7fb1d5d6180a87a2b3324) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with npm provenance

## 3.0.1

### Patch Changes

- [#877](https://github.com/belgattitude/httpx/pull/877) [`e329bcd`](https://github.com/belgattitude/httpx/commit/e329bcd54a5daa4eafb8a9e95117eb2bc07cad1a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add npm provenance to releases

## 3.0.0

### Major Changes

- [#873](https://github.com/belgattitude/httpx/pull/873) [`62332de`](https://github.com/belgattitude/httpx/commit/62332deb1c9d1b66d6a366602d60df23eb62ea69) Thanks [@belgattitude](https://github.com/belgattitude)! - Stack traces won't be serialized anymore by default as they
  might contain sensitive information in production.

  For development or logging, it's possible to opt-in stack serialization selectively in
  `convertToSerializable`, `createFromSerializable`, `toJson` and `fromJson` functions thanks
  to the `SerializerParams.includeStack` param.

  ```typescript
  import { fromJson, toJson } from "@httpx/exception";

  const json = toJson(new HttpException(500), {
    includeStack: process.env.NODE_ENV === "development",
  });

  const e = fromJson(json, {
    includeStack: process.env.NODE_ENV === "development",
  });
  ```

- [#865](https://github.com/belgattitude/httpx/pull/865) [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove deprecated `errors` param from `HttpBadRequest`, use `issues` in `HttpUnprocessableEntity` instead

- [#865](https://github.com/belgattitude/httpx/pull/865) [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove deprecated `errors` params from `HttpUnprocessableEntity`, use `issues` instead

- [#865](https://github.com/belgattitude/httpx/pull/865) [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove deprecated type `HttpStatusCode`, use `HttpErrorStatusCode` instead.

- [#865](https://github.com/belgattitude/httpx/pull/865) [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove deprecated type `ValidationError`, use `HttpValidationIssue` instead.

### Minor Changes

- [#865](https://github.com/belgattitude/httpx/pull/865) [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce typical usage bundle size to 400b-660b range

- [#873](https://github.com/belgattitude/httpx/pull/873) [`62332de`](https://github.com/belgattitude/httpx/commit/62332deb1c9d1b66d6a366602d60df23eb62ea69) Thanks [@belgattitude](https://github.com/belgattitude)! - Add `SerializerParams.includeStack` to `toJson` and `fromJson` serialization functions.

- [#873](https://github.com/belgattitude/httpx/pull/873) [`62332de`](https://github.com/belgattitude/httpx/commit/62332deb1c9d1b66d6a366602d60df23eb62ea69) Thanks [@belgattitude](https://github.com/belgattitude)! - Add `SerializerParams.includeStack` to `convertToSerializable` and `createFromSerializable` serialization functions.

### Patch Changes

- [#870](https://github.com/belgattitude/httpx/pull/870) [`5ea92c1`](https://github.com/belgattitude/httpx/commit/5ea92c121c8eed646c3a75a432baf1c2eee1ce44) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix cause support in SerializerError on env that doesn't support Error.cause

- [#875](https://github.com/belgattitude/httpx/pull/875) [`b6e2941`](https://github.com/belgattitude/httpx/commit/b6e2941134fcc3de7cde6666067f202f8b6de408) Thanks [@belgattitude](https://github.com/belgattitude)! - Update to rollup 4.9.4

- [#869](https://github.com/belgattitude/httpx/pull/869) [`c65e11a`](https://github.com/belgattitude/httpx/commit/c65e11a310a704d5b22f7df8e6de866efd525d80) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix missing export of isObjectWithErrorStatusCode

## 2.6.4

### Patch Changes

- [#858](https://github.com/belgattitude/httpx/pull/858) [`76fd8dc`](https://github.com/belgattitude/httpx/commit/76fd8dc1500125534033845029144ddc091a74a7) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with no changes

## 2.6.3

### Patch Changes

- [`b418b0b`](https://github.com/belgattitude/httpx/commit/b418b0b8dc914abe3dda3a9893bd0cba1db87560) Thanks [@belgattitude](https://github.com/belgattitude)! - Release unreleased patches

- [#854](https://github.com/belgattitude/httpx/pull/854) [`f01defc`](https://github.com/belgattitude/httpx/commit/f01defc16e0f539cb8bbadd95ef2ab25ea1c1601) Thanks [@belgattitude](https://github.com/belgattitude)! - Add doc for nested errors

## 2.6.2

### Patch Changes

- [#850](https://github.com/belgattitude/httpx/pull/850) [`e17f083`](https://github.com/belgattitude/httpx/commit/e17f0836c4759c0fec29b2beb0c5c46b55a045a4) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix potential cyclic imports

## 2.6.1

### Patch Changes

- [#834](https://github.com/belgattitude/httpx/pull/834) [`9d4dd98`](https://github.com/belgattitude/httpx/commit/9d4dd980ea57b99f4697191ac5b2d8d55adcb406) Thanks [@belgattitude](https://github.com/belgattitude)! - Add missing doc for nested errors

- [#832](https://github.com/belgattitude/httpx/pull/832) [`321957a`](https://github.com/belgattitude/httpx/commit/321957a9eced15ff132c2ab18789bc4bcde9ff95) Thanks [@belgattitude](https://github.com/belgattitude)! - esbuild updated to 0.19.11 to fix a potential typeScript-specific class transform edge case

## 2.6.0

### Minor Changes

- [#815](https://github.com/belgattitude/httpx/pull/815) [`77cd15b`](https://github.com/belgattitude/httpx/commit/77cd15b89fb3d88f1f60babffdaf76e8fa516bf1) Thanks [@belgattitude](https://github.com/belgattitude)! - Deprecate the type `HttpStatusCode`, use `HttpErrorStatusCode` instead

  HttpErrorStatusCode is less ambiguous ad HttpStatusCode could be understood
  as HttpStatusCode could represent all http statuses. The type is exported
  but there's very few chances an regular user would be impacted.

- [#815](https://github.com/belgattitude/httpx/pull/815) [`77cd15b`](https://github.com/belgattitude/httpx/commit/77cd15b89fb3d88f1f60babffdaf76e8fa516bf1) Thanks [@belgattitude](https://github.com/belgattitude)! - Add new types: HttpErrorStatusCode and HttpErrorStatusCodeOrNumber

  Improves the typescript experience by allowing typescript to suggest assigned
  status codes in `createException` and `HttpException`, `HttpClientException`,
  `HttpServerException` constructors. Arbitray numbers can still be used.

- [#815](https://github.com/belgattitude/httpx/pull/815) [`77cd15b`](https://github.com/belgattitude/httpx/commit/77cd15b89fb3d88f1f60babffdaf76e8fa516bf1) Thanks [@belgattitude](https://github.com/belgattitude)! - Add new typeguards: isErrorWithErrorStatusCode and isObjectWithErrorStatusCode

  Those typeguards can be used in specific circumstances when an originating
  error has a statusCode field which indicates by convention the preferred status
  to send.

  ```typescript
  import {
    isErrorWithErrorStatusCode,
    createHttpException,
  } from "@httpx/exception";

  try {
    throw new (class extends Error {
      statusCode = 400;
    })();
  } catch (e) {
    if (isErrorWithErrorStatusCode(e)) {
      throw createException(e.statusCode, "Something wrong happened");
    }
  }
  ```

  ```typescript
  const noSuchUser = {
    statusCode: 404,
  } satisfies ObjectWithStatusCode;

  class NoSuchItem extends DomainError implements ObjectWithStatusCode {
    statusCode: 404;
  }

  if (isObjectWithErrorStatusCode(noSuchUser)) {
    throw createException(e.statusCode, "Nothing");
  }
  ```

## 2.5.7

### Patch Changes

- [#788](https://github.com/belgattitude/httpx/pull/788) [`b004243`](https://github.com/belgattitude/httpx/commit/b004243a97cca2df472e97114cfdf1cbd03cb1a6) Thanks [@belgattitude](https://github.com/belgattitude)! - Add toc in readme

## 2.5.6

### Patch Changes

- [#787](https://github.com/belgattitude/httpx/pull/787) [`39ec1d5`](https://github.com/belgattitude/httpx/commit/39ec1d525d63db3d9e0400689e73f9c32eed91ed) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix README doc links

## 2.5.5

### Patch Changes

- [#781](https://github.com/belgattitude/httpx/pull/781) [`4e2b795`](https://github.com/belgattitude/httpx/commit/4e2b795a69914f22d01a5137ce38e9fb39e40ed7) Thanks [@belgattitude](https://github.com/belgattitude)! - Ensure compat for Chrome 96+, Firefox 90+, Edge 91+, Safari 15+ and Opera 77+

## 2.5.4

### Patch Changes

- [#778](https://github.com/belgattitude/httpx/pull/778) [`d76a2f9`](https://github.com/belgattitude/httpx/commit/d76a2f9692fcc1083ebdfff3342b91fa30179a6f) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce bundle size of createException (-20b)

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
