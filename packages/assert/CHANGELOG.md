# @httpx/assert

## 0.13.2

### Patch Changes

- [#1515](https://github.com/belgattitude/httpx/pull/1515) [`2692a50`](https://github.com/belgattitude/httpx/commit/2692a50a3f1f1ae1d3d8e6f9269b62483b369638) Thanks [@renovate](https://github.com/apps/renovate)! - Improve isPlainObject and base it on @httpx/plain-object

## 0.13.1

### Patch Changes

- [#1434](https://github.com/belgattitude/httpx/pull/1434) [`6bd5105`](https://github.com/belgattitude/httpx/commit/6bd5105190e290b84417a8b8fe535b3a3df9816b) Thanks [@belgattitude](https://github.com/belgattitude)! - [internal cleanup] refactor some unions with undefined for optional parameters

## 0.13.0

### Minor Changes

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Add INVALID_ARGUMENT reason to assertParsableStrictIsoDateZ

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - BC getUuidVersion returns null instead of false when the uuid isn't correct

### Patch Changes

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal refactor based on linter updates

## 0.12.4

### Patch Changes

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add git url prefix in package.json

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove unecessary default condition from exports

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add publint after arethetypeswrong checks

## 0.12.3

### Patch Changes

- [#1275](https://github.com/belgattitude/httpx/pull/1275) [`bd35900`](https://github.com/belgattitude/httpx/commit/bd35900b4a57c27f0aa15dd32cd833fcadff23ed) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix and improve assert documentation README

## 0.12.2

### Patch Changes

- [#1236](https://github.com/belgattitude/httpx/pull/1236) [`08e61f7`](https://github.com/belgattitude/httpx/commit/08e61f7a1ba9da91063d91144191938287f57be7) Thanks [@belgattitude](https://github.com/belgattitude)! - make assertParsableStrictIsoDateZ case insensitive

## 0.12.1

### Patch Changes

- [#1234](https://github.com/belgattitude/httpx/pull/1234) [`19a5292`](https://github.com/belgattitude/httpx/commit/19a52921ba7df6bc1828cf7070d76695b79b4372) Thanks [@belgattitude](https://github.com/belgattitude)! - isPlainObject properly support node:vm.runInNewContex('({})')

## 0.12.0

### Minor Changes

- [#1231](https://github.com/belgattitude/httpx/pull/1231) [`fd2ecd3`](https://github.com/belgattitude/httpx/commit/fd2ecd3be46884719331f6142d0170ae066f7712) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve PlainObject convenience typings when passing a generic.

  ```typescript
  import { isPlainObject, assertPlainObject } from "@httpx/assert";

  type TValue = {
    key: string;
    deep: {
      connected: boolean;
    };
  };
  const value = {
    key: "hello",
    deep: {
      connected: true,
    },
  } as unknown;

  // Without generic

  assertPlainObject(value);
  // value is Record<string, unknown>
  // -> no typing

  value.key; // unknown, no runtime error
  value.anything; // unknown, no runtime error
  // value.deep.connected // not possible without explicit typing

  // With generic

  assertPlainObject<TValue>(value);

  value.key; // unknown, no runtime error
  value.anything; // unknown, no runtime error
  value.deep?.connected; // connected is 'unknown', typescript suggest the type
  ```

## 0.11.0

### Minor Changes

- [#1217](https://github.com/belgattitude/httpx/pull/1217) [`da8474c`](https://github.com/belgattitude/httpx/commit/da8474c55b0a5ae876c0fdff5d7d7e0b237b4ab2) Thanks [@belgattitude](https://github.com/belgattitude)! - @httpx/assert - drop node 16

- [#1217](https://github.com/belgattitude/httpx/pull/1217) [`da8474c`](https://github.com/belgattitude/httpx/commit/da8474c55b0a5ae876c0fdff5d7d7e0b237b4ab2) Thanks [@belgattitude](https://github.com/belgattitude)! - Small perf for isPlainObject and add benchmark

- [`ad7345f`](https://github.com/belgattitude/httpx/commit/ad7345f38026516106eb057d4e8210b94e98bf2d) Thanks [@belgattitude](https://github.com/belgattitude)! - Drop "official" support for node 16 and typesript < 5

## 0.10.3

### Patch Changes

- [#1214](https://github.com/belgattitude/httpx/pull/1214) [`226a4b1`](https://github.com/belgattitude/httpx/commit/226a4b12e5fd3eb6eb2a033f13b7988c2e97587c) Thanks [@belgattitude](https://github.com/belgattitude)! - isPlainObject allows Object.create(null) and disallow stringTagName and iterators symbols

## 0.10.2

### Patch Changes

- [`fd1d0c5`](https://github.com/belgattitude/httpx/commit/fd1d0c535cb566f913ee57bad40a5cea783d775b) Thanks [@belgattitude](https://github.com/belgattitude)! - isPlainObject works with partial types

## 0.10.1

### Patch Changes

- [`943adcd`](https://github.com/belgattitude/httpx/commit/943adcdebc149447ad4b17452fc7cefe7bab19a1) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix type exports for object types

## 0.10.0

### Minor Changes

- [#1171](https://github.com/belgattitude/httpx/pull/1171) [`7fdbf08`](https://github.com/belgattitude/httpx/commit/7fdbf08bd5e3ba727e134b33656cfbf668f43cb4) Thanks [@belgattitude](https://github.com/belgattitude)! - Add generic convenience typing in isPlainObject

  You can now pass a generic type in isPlainObject and assertPlainObject.

  It allows to get typescript autocompletion after running isPlainObject<CustomType>(v).
  But notice all keys becomes optional and values are set to unknown in this case to reflect
  that no runtime check was done.

  #### isPlainObject

  | Name                  | Type                                                                      | Comment |
  | --------------------- | ------------------------------------------------------------------------- | ------- |
  | isPlainObject<T?>     | `PlainObject<T extends Record<string, unknown> = Record<string, unknown>` |         |
  | assertPlainObject<T?> | `PlainObject<T extends Record<string, unknown> = Record<string, unknown>` |         |

  ```typescript
  import { isPlainObject, assertPlainObject } from "@httpx/assert";

  // Simple case: without generic value
  isPlainObject({ cwol: true }); // 👈 true
  isPlainObject(new Promise()); // 👈 false
  assertPlainObject({});

  // With generic value (unchecked at runtime!)
  type CustomType = {
    name: string;
    deep: {
      yes: boolean | null;
    };
  };
  const value = {
    name: "hello",
    deep: {
      yes: true,
    },
  } as unknown;

  if (isPlainObject<CustomType>(value)) {
    // Notice it's a deep partial to allow autocompletion
    const test = value?.deep?.yes; // 👈  yes will be unknown (no runtime check)
  }
  ```

## 0.9.1

### Patch Changes

- [#1167](https://github.com/belgattitude/httpx/pull/1167) [`bfd78a3`](https://github.com/belgattitude/httpx/commit/bfd78a3d42b2e52c6667ead29b71b61a1a6ef504) Thanks [@belgattitude](https://github.com/belgattitude)! - Add missing documentation in TOC

## 0.9.0

### Minor Changes

- [#1157](https://github.com/belgattitude/httpx/pull/1157) [`0d3b113`](https://github.com/belgattitude/httpx/commit/0d3b1132debe0fb4c396643ee05882315d632518) Thanks [@belgattitude](https://github.com/belgattitude)! - Add network port and http methods typeguard and assertions

### Patch Changes

- [#1157](https://github.com/belgattitude/httpx/pull/1157) [`0d3b113`](https://github.com/belgattitude/httpx/commit/0d3b1132debe0fb4c396643ee05882315d632518) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix isPlainObject when testing Object.create(null)

- [#1157](https://github.com/belgattitude/httpx/pull/1157) [`0d3b113`](https://github.com/belgattitude/httpx/commit/0d3b1132debe0fb4c396643ee05882315d632518) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix isNumberSafeInt return

## 0.8.1

### Patch Changes

- [#1154](https://github.com/belgattitude/httpx/pull/1154) [`6a52be7`](https://github.com/belgattitude/httpx/commit/6a52be772efd39c8270f26993d718b180d726539) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild using esbuild 0.20.2

## 0.8.0

### Minor Changes

- [#1098](https://github.com/belgattitude/httpx/pull/1098) [`1958776`](https://github.com/belgattitude/httpx/commit/1958776623c71ba2fc8c2a2daa7d985ce67e0715) Thanks [@belgattitude](https://github.com/belgattitude)! - Add UUID v7 support

## 0.7.0

### Minor Changes

- [#885](https://github.com/belgattitude/httpx/pull/885) [`bfe4861`](https://github.com/belgattitude/httpx/commit/bfe4861a5f745c8361b671542d15dfb77c435455) Thanks [@belgattitude](https://github.com/belgattitude)! - Return weak opaque type StringNonEmpty from assertStringNonEmpty

- [#885](https://github.com/belgattitude/httpx/pull/885) [`bfe4861`](https://github.com/belgattitude/httpx/commit/bfe4861a5f745c8361b671542d15dfb77c435455) Thanks [@belgattitude](https://github.com/belgattitude)! - BC: rename assertStrNotEmpty to assertStringNonEmpty

### Patch Changes

- [#885](https://github.com/belgattitude/httpx/pull/885) [`bfe4861`](https://github.com/belgattitude/httpx/commit/bfe4861a5f745c8361b671542d15dfb77c435455) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix weak opaque type signature for StringNonEmpty

## 0.6.7

### Patch Changes

- [`28687e1`](https://github.com/belgattitude/httpx/commit/28687e16e42019d3d9f7fb1d5d6180a87a2b3324) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with npm provenance

## 0.6.6

### Patch Changes

- [#877](https://github.com/belgattitude/httpx/pull/877) [`e329bcd`](https://github.com/belgattitude/httpx/commit/e329bcd54a5daa4eafb8a9e95117eb2bc07cad1a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add npm provenance to releases

## 0.6.5

### Patch Changes

- [#875](https://github.com/belgattitude/httpx/pull/875) [`b6e2941`](https://github.com/belgattitude/httpx/commit/b6e2941134fcc3de7cde6666067f202f8b6de408) Thanks [@belgattitude](https://github.com/belgattitude)! - Update to rollup 4.9.4

## 0.6.4

### Patch Changes

- [#858](https://github.com/belgattitude/httpx/pull/858) [`76fd8dc`](https://github.com/belgattitude/httpx/commit/76fd8dc1500125534033845029144ddc091a74a7) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with no changes

## 0.6.3

### Patch Changes

- [#856](https://github.com/belgattitude/httpx/pull/856) [`ef4e8c7`](https://github.com/belgattitude/httpx/commit/ef4e8c765c7e63efe38b569385b99cc69bc7f05f) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve documentation

## 0.6.2

### Patch Changes

- [`b418b0b`](https://github.com/belgattitude/httpx/commit/b418b0b8dc914abe3dda3a9893bd0cba1db87560) Thanks [@belgattitude](https://github.com/belgattitude)! - Release unreleased patches

## 0.6.1

### Patch Changes

- [#852](https://github.com/belgattitude/httpx/pull/852) [`4dad928`](https://github.com/belgattitude/httpx/commit/4dad92830fe144a9aa1353431b44a58d09967866) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix export of empty chunks for type only exports

## 0.6.0

### Minor Changes

- [`7d399ec`](https://github.com/belgattitude/httpx/commit/7d399ec319cceb432308ae00a0680ef35f4af853) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename isStrNotEmpty into isStringNonEmpty

- [#847](https://github.com/belgattitude/httpx/pull/847) [`6b3f2d6`](https://github.com/belgattitude/httpx/commit/6b3f2d637c176c52b2ae62f650835695d20f10ff) Thanks [@belgattitude](https://github.com/belgattitude)! - Ass weak opaque type support for primitive types

- [#837](https://github.com/belgattitude/httpx/pull/837) [`ff994ff`](https://github.com/belgattitude/httpx/commit/ff994ff5a450c5e8cb1af40d3c1d88b1fc7acbaf) Thanks [@belgattitude](https://github.com/belgattitude)! - add assertStrParsableStrictIsoDateZ and isStrParsableStrictIsoDateZ

- [`7d399ec`](https://github.com/belgattitude/httpx/commit/7d399ec319cceb432308ae00a0680ef35f4af853) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename isStrParsableSafeInt into isParsableSafeInt

- [`7d399ec`](https://github.com/belgattitude/httpx/commit/7d399ec319cceb432308ae00a0680ef35f4af853) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename isArrayNotEmpty into isArrayNonEmpty

- [#844](https://github.com/belgattitude/httpx/pull/844) [`4ccebfe`](https://github.com/belgattitude/httpx/commit/4ccebfe7d91a795537e2d3b3b9b4287fa9d342e8) Thanks [@belgattitude](https://github.com/belgattitude)! - remove trim parameter from isStrNotEmpty

## 0.5.2

### Patch Changes

- [#835](https://github.com/belgattitude/httpx/pull/835) [`b14449f`](https://github.com/belgattitude/httpx/commit/b14449f52e2fbf68e8c5ccb92fc9e2be9b961386) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve documentation

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
    new TypeError("Value is expected to be an uuid, got: string(3)")
  );
  expect(() => assertUuid(false, undefined, { version: 1 })).toThrow(
    new TypeError("Value is expected to be an uuid v1, got: boolean(false)")
  );
  expect(() => assertUuidV1(Number.NaN)).toThrow(
    new TypeError("Value is expected to be an uuid v1, got: NaN")
  );
  expect(() => assertUuidV3(new Error())).toThrow(
    new TypeError("Value is expected to be an uuid v3, got: Error")
  );
  expect(() => assertUuidV4(new Date())).toThrow(
    new TypeError("Value is expected to be an uuid v4, got: Date")
  );
  expect(() => assertUuidV5(() => {})).toThrow(
    new TypeError("Value is expected to be an uuid v5, got: function")
  );
  ```

## 0.2.0

### Minor Changes

- [#822](https://github.com/belgattitude/httpx/pull/822) [`24ccdee`](https://github.com/belgattitude/httpx/commit/24ccdeea4a6ba77f4dc2ab99b96eef3669a88aa1) Thanks [@belgattitude](https://github.com/belgattitude)! - Reduce bundle size for esm

## 0.1.0

### Minor Changes

- [#820](https://github.com/belgattitude/httpx/pull/820) [`b32e907`](https://github.com/belgattitude/httpx/commit/b32e90716a4fb8f68329eb894a29f9faa99e40da) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial @httpx/assert package
