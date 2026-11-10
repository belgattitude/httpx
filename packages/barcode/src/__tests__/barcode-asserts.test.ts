import { describe, expect, expectTypeOf, it } from "vitest";

import {
  assertEan8,
  assertEan13,
  assertGtin14,
  assertUpcA,
  assertGtin,
} from "../barcode-asserts";
import { isInStoreGtin } from "../is-in-store-gtin";
import type { Ean8, Ean13, Gtin, Gtin14, UpcA } from "../types";

class HttpBadRequestError extends Error {
  override readonly name = "HttpBadRequestError";
}

const cases = [
  { fn: assertEan13, valid: "4006381333931", label: "an EAN-13" },
  { fn: assertEan8, valid: "96385074", label: "an EAN-8" },
  { fn: assertUpcA, valid: "036000291452", label: "a UPC-A" },
  { fn: assertGtin14, valid: "10012345678902", label: "a GTIN-14" },
  { fn: assertGtin, valid: "4006381333931", label: "a GTIN" },
] as const;

describe.each(cases)("$fn.name", ({ fn, valid, label }) => {
  it("should not throw on a valid value", () => {
    expect(() => fn(valid)).not.toThrow();
  });

  it.each([
    ["400638133393", "string(length:12)"],
    ["4006381333932", "string(length:13)"],
    [4_006_381_333_931, "number"],
    [null, "null"],
    [undefined, "undefined"],
    [["4006381333931"], "array(size:1)"],
    [{}, "object"],
  ])(
    "should throw a TypeError with a default message for %s",
    (v, typeInfo) => {
      expect(() => fn(v)).toThrow(
        new TypeError(`Value is expected to be ${label}, got: ${typeInfo}`)
      );
    }
  );

  it("should never trim (the narrowed value would keep its whitespace)", () => {
    expect(() => fn(` ${valid}`)).toThrow(TypeError);
    expect(() => fn(`${valid}\n`)).toThrow(TypeError);
  });

  it("should throw a TypeError with a custom message", () => {
    expect(() => fn("123", "Invalid barcode")).toThrow(
      new TypeError("Invalid barcode")
    );
  });

  it("should throw the error returned by the factory", () => {
    expect(() =>
      fn("123", () => new HttpBadRequestError("Bad barcode"))
    ).toThrow(HttpBadRequestError);
  });

  it("should accept restricted circulation numbers (in-store codes)", () => {
    // EAN-8 / UPC-A / EAN-13 / GTIN-14 restricted circulation numbers
    const rcnByFn: Record<string, string> = {
      assertEan13: "2123456789010",
      assertEan8: "21234569",
      assertUpcA: "212345678992",
      assertGtin14: "02123456789010",
      assertGtin: "2123456789010",
    };
    const rcn = rcnByFn[fn.name];
    expect(isInStoreGtin(rcn)).toBe(true);
    expect(() => fn(rcn)).not.toThrow();
  });

  it("should pass the value to the factory", () => {
    expect(() =>
      fn(12, (v) => new HttpBadRequestError(`Bad barcode (${typeof v})`))
    ).toThrow(new HttpBadRequestError("Bad barcode (number)"));
  });
});

describe("assert type narrowing", () => {
  it("should narrow unknown values to branded types", () => {
    const ean13: unknown = "4006381333931";
    assertEan13(ean13);
    expectTypeOf(ean13).toEqualTypeOf<Ean13>();

    const ean8: unknown = "96385074";
    assertEan8(ean8);
    expectTypeOf(ean8).toEqualTypeOf<Ean8>();

    const upcA: unknown = "036000291452";
    assertUpcA(upcA);
    expectTypeOf(upcA).toEqualTypeOf<UpcA>();

    const gtin14: unknown = "10012345678902";
    assertGtin14(gtin14);
    expectTypeOf(gtin14).toEqualTypeOf<Gtin14>();

    const gtin: unknown = "96385074";
    assertGtin(gtin);
    expectTypeOf(gtin).toEqualTypeOf<Gtin>();
  });

  it("should accept a zero-argument factory (@httpx/assert compatible)", () => {
    expectTypeOf(() => new Error("x")).toExtend<
      Parameters<typeof assertEan13>[1]
    >();
  });
});
