import { assertType, expect, expectTypeOf } from "vitest";

import { assertPlainObject } from "../assert-plain-object";
import type { PlainObjectDeepPartialUnknown } from "../internal.types";
import { isPlainObject } from "../is-plain-object";
import type { PlainObject } from "../plain-object.types";

describe("plain-object types tests", () => {
  describe("assertPlainObject", () => {
    describe("when no generic is given", () => {
      it("should return a type PlainObject compatible Record<string, unknown>", () => {
        const unknownPo = {
          key: "value",
        } as unknown;

        // @ts-expect-error ensure our plain object is unknown
        const _notInferrable1 = unknownPo.key;
        // @ts-expect-error ensure our plain object is unknown
        const _notInferrable2 = unknownPo.invalidKey;

        // act
        assertPlainObject(unknownPo);

        assertType<PlainObject>(unknownPo);

        // Now the type is Record<string, unknown>, javascript allows to retrieve it
        // even if it doesn't exist. The value should be undefined|unknown
        const invalidKeyIsUnknown = unknownPo.invalidKey;
        expect(invalidKeyIsUnknown).toBeUndefined();
        // when removing the nullable (undefined) from the union
        expectTypeOf(invalidKeyIsUnknown).toBeUnknown();

        assertType<PlainObject>(unknownPo);
        assertType<Record<string, unknown>>(unknownPo);
        expectTypeOf(unknownPo.key).not.toBeString();
        expectTypeOf(unknownPo.key).not.toBeString();
      });
    });
  });

  describe("isPlainObject", () => {
    it(`should not make any assumptions when the value isn't statically known`, () => {
      const unknownPo = {
        key: "value",
      } as unknown;
      const typed = isPlainObject(unknownPo);
      if (!typed) {
        throw new Error("Test code is incorrect");
      }
      assertType<PlainObject>(unknownPo);
      expectTypeOf(unknownPo.key).not.toBeString();
    });

    it(`should preserve typings if value is statically known`, () => {
      const knownPo = {
        key: "value",
      };
      const typed = isPlainObject(knownPo);
      if (!typed) {
        throw new Error("Test code is incorrect");
      }
      assertType<PlainObject>(knownPo);
      expectTypeOf(knownPo.key).toBeString();
    });

    it("should offer convenience typings when a type is given", () => {
      type CustomType = {
        name: string;
        deep: {
          yes: boolean | null;
        };
      };
      const unknownPo = {
        name: "hello",
        deep: {
          yes: true,
        },
      } as unknown;
      const typed = isPlainObject<CustomType>(unknownPo);
      if (!typed) {
        throw new Error("Test code is incorrect");
      }
      assertType<PlainObject<CustomType>>(unknownPo);
      assertType<Record<string, unknown>>(unknownPo);
      assertType<object | undefined>(unknownPo?.deep);
      assertType<unknown>(unknownPo?.deep?.yes);
      expectTypeOf(unknownPo.name).not.toBeString();
    });

    it("should return a type PlainObject with shaped non null | undefined values", () => {
      type DeepCustomType = {
        id: number;
        requiredDeep: {
          idReq: number;
        };
        data?: {
          test: string[];
          attributes?: {
            url?: string | null;
            caption?: string | null;
            alternativeText?: string | null;
          } | null;
        } | null;
      };
      const po = {
        id: 1,
        requiredDeep: {
          idReq: 1,
        },
        data: {
          attributes: {
            url: "cool",
            caption: "test",
          },
        },
      } as unknown;
      const typed = isPlainObject<DeepCustomType>(po);
      if (!typed) {
        throw new Error("Test code is incorrect");
      }
      assertType<PlainObject>(po);
      assertType<PlainObject<DeepCustomType>>(po);
      assertType<Record<string, unknown>>(po);
      assertType<Record<number, unknown>>(po);
      assertType<Record<string | number, unknown>>(po);
      assertType<PlainObjectDeepPartialUnknown<DeepCustomType>>(po);
      expectTypeOf(po?.data).not.toBeUnknown();
      expectTypeOf(po?.data?.attributes).not.toBeUnknown();
      expectTypeOf(po?.data?.attributes?.url).toBeUnknown();
      expectTypeOf(po?.data?.attributes?.url).not.toBeString();
      expectTypeOf(po?.id).toBeUnknown();
      expectTypeOf(po?.requiredDeep?.idReq).toBeUnknown();
    });
  });

  describe("static built-in classes", () => {
    it("should fail typecheck when a static built-in class is given", () => {
      // @ts-expect-error Math is not a plain object
      isPlainObject(Math);
      // @ts-expect-error JSON is not a plain object
      isPlainObject(JSON);
      // @ts-expect-error Atomics is not a plain object
      isPlainObject(Atomics);
      // @ts-expect-error Reflect is not a plain object
      isPlainObject(Reflect);
      // @ts-expect-error Intl is not a plain object
      isPlainObject(Intl);
      // @ts-expect-error WebAssembly is not a plain object
      isPlainObject(WebAssembly);
      // @ts-expect-error Math is not a plain object
      isPlainObject<{ a: string }, Math>(Math);
      expect(() => {
        // @ts-expect-error Math is not a plain object
        assertPlainObject(Math);
        // @ts-expect-error Intl is not a plain object
        assertPlainObject(Intl, "message");
      }).not.toThrow();
    });

    it("should not fail typecheck when the value isn't statically known", () => {
      const unknownValue = Math as unknown;
      // oxlint-disable-next-line typescript/no-explicit-any
      const anyValue = Math as any;
      const objectValue = Math as object;
      expect(isPlainObject(unknownValue)).toBe(true);
      expect(isPlainObject(anyValue)).toBe(true);
      expect(isPlainObject(objectValue)).toBe(true);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject("str")).toBe(false);
      expect(isPlainObject({ a: 1 })).toBe(true);
    });

    it("should keep working as a callback", () => {
      const values: unknown[] = [{ a: 1 }, null, "str"];
      const filtered = values.filter(isPlainObject);
      expectTypeOf(filtered).toEqualTypeOf<Record<PropertyKey, unknown>[]>();
      expect(filtered).toStrictEqual([{ a: 1 }]);
    });

    it("should accept assertPlainObject message or error factory", () => {
      expect(() => assertPlainObject(null, "message")).toThrow("message");
      expect(() => assertPlainObject(null, () => new Error("factory"))).toThrow(
        "factory"
      );
    });

    it("should preserve narrowing of unions", () => {
      const value = { a: 1 } as string | { a: number } | null;
      if (isPlainObject(value)) {
        expectTypeOf(value).toEqualTypeOf<{ a: number }>();
      }
    });
  });
});
