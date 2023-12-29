# @httpx/assert

## 0.5.1

### Patch Changes

- [#832](https://github.com/belgattitude/httpx/pull/832) [`321957a`](https://github.com/belgattitude/httpx/commit/321957a9eced15ff132c2ab18789bc4bcde9ff95) Thanks [@belgattitude](https://github.com/belgattitude)! - esbuild updated to 0.19.11 to fix a potential typeScript-specific class transform edge case

## 0.5.0

### Minor Changes

- [#829](https://github.com/belgattitude/httpx/pull/829) [`b3ff1b9`](https://github.com/belgattitude/httpx/commit/b3ff1b901a613ba60d0c9de7fd6663e301d26412) Thanks [@belgattitude](https://github.com/belgattitude)! - Add assertNumberSafeInt, isNumberSafeInt and NumberSafeInt type

- [#829](https://github.com/belgattitude/httpx/pull/829) [`b3ff1b9`](https://github.com/belgattitude/httpx/commit/b3ff1b901a613ba60d0c9de7fd6663e301d26412) Thanks [@belgattitude](https://github.com/belgattitude)! - Add isArrayNotEmpty, assertArrayNotEmpty and ArrayNotEmpty type

- [#829](https://github.com/belgattitude/httpx/pull/829) [`b3ff1b9`](https://github.com/belgattitude/httpx/commit/b3ff1b901a613ba60d0c9de7fd6663e301d26412) Thanks [@belgattitude](https://github.com/belgattitude)! - Add isStrParsableSafeInt, assertStrParsableSafeInt and type StrParsableSafeInt

## 0.4.0

### Minor Changes

- [`18aad8b`](https://github.com/belgattitude/httpx/commit/18aad8b25b657bbbd9838b523121d19fd4da0e26) Thanks [@belgattitude](https://github.com/belgattitude)! - Add assertNever and assertNeverNoThrow

## 0.3.0

### Minor Changes

- [#826](https://github.com/belgattitude/httpx/pull/826) [`a2f8352`](https://github.com/belgattitude/httpx/commit/a2f8352a745af0ed0f1c54f134f8b27dec2878e3) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve assertion error messages (now typed as TypeError)

  Assertions errors includes information about received value. They're
  now typed as native TypeError.

  ```typescript
  expect(() => assertUuid("123")).toThrow(
    new TypeError("Value is expected to be an uuid, got: string(3)"),
  );
  expect(() => assertUuid(false, undefined, { version: 1 })).toThrow(
    new TypeError("Value is expected to be an uuid v1, got: boolean(false)"),
  );
  expect(() => assertUuidV1(Number.NaN)).toThrow(
    new TypeError("Value is expected to be an uuid v1, got: NaN"),
  );
  expect(() => assertUuidV3(new Error())).toThrow(
    new TypeError("Value is expected to be an uuid v3, got: Error"),
  );
  expect(() => assertUuidV4(new Date())).toThrow(
    new TypeError("Value is expected to be an uuid v4, got: Date"),
  );
  expect(() => assertUuidV5(() => {})).toThrow(
    new TypeError("Value is expected to be an uuid v5, got: function"),
  );
  ```

## 0.2.0

### Minor Changes

- [#822](https://github.com/belgattitude/httpx/pull/822) [`24ccdee`](https://github.com/belgattitude/httpx/commit/24ccdeea4a6ba77f4dc2ab99b96eef3669a88aa1) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce bundle size for esm

## 0.1.0

### Minor Changes

- [#820](https://github.com/belgattitude/httpx/pull/820) [`b32e907`](https://github.com/belgattitude/httpx/commit/b32e90716a4fb8f68329eb894a29f9faa99e40da) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial @httpx/assert package
