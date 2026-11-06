import { describe, expect, expectTypeOf, it } from "vitest";

import { assertNormalizedGtin, normalizeGtin } from "../normalize-gtin";
import type { Gtin14 } from "../types";

describe("normalizeGtin", () => {
  it.each([
    // leading zeros lost (numbers)
    [36_000_291_452, "00036000291452"],
    [96_385_074, "00000096385074"],
    [4_006_381_333_931, "04006381333931"],
    [10_012_345_678_902, "10012345678902"],
    // strings of every length, same product gives the same result
    ["96385074", "00000096385074"],
    ["036000291452", "00036000291452"],
    ["0036000291452", "00036000291452"],
    ["00036000291452", "00036000291452"],
    ["36000291452", "00036000291452"],
    // bigints
    [4_006_381_333_931n, "04006381333931"],
    [10_012_345_678_902n, "10012345678902"],
  ])("should normalize %s to %s", (value, expected) => {
    expect(normalizeGtin(value)).toBe(expected);
  });

  it.each([
    [4_006_381_333_932, "invalid check digit"],
    [4_006_380_000_000, "excel scientific notation (4.00638E+12)"],
    ["4006381333932", "invalid check digit (string)"],
    [1_234_565, "7 digits < default minLength"],
    ["1234565", "7 digits < default minLength (string)"],
    ["123456789012345", "15 digits"],
    [100_123_456_789_028, "15 digits (number)"],
    [-4_006_381_333_931, "negative number"],
    [-4_006_381_333_931n, "negative bigint"],
    [4_006_381_333.931, "float"],
    [Number.NaN, "NaN"],
    [Number.POSITIVE_INFINITY, "Infinity"],
    ["400638133393a", "non digit"],
    [" 4006381333931", "leading space (no trimming)"],
    ["4006-381333931", "separator"],
    ["", "empty string"],
    [null, "null"],
    [undefined, "undefined"],
    [{}, "object"],
  ])("should return null for %s (%s)", (value, _reason) => {
    expect(normalizeGtin(value)).toBeNull();
  });

  describe("restricted circulation EAN-8 (starting with 0 or 2)", () => {
    it.each([
      ["01234565", "EAN-8 starting with 0"],
      ["21234569", "EAN-8 starting with 2"],
      [1_234_565, "01234565 with its leading zero lost"],
      [21_234_569, "number"],
      [21_234_569n, "bigint"],
      ["000021234569", "padded as UPC-A"],
      ["0000021234569", "padded as EAN-13"],
      ["00000021234569", "padded as GTIN-14"],
    ])("should return null for %s (%s)", (value, _reason) => {
      expect(normalizeGtin(value)).toBeNull();
    });

    it("should still accept other EAN-8", () => {
      expect(normalizeGtin("96385074")).toBe("00000096385074");
      expect(normalizeGtin("73513537")).toBe("00000073513537");
    });

    it("should not refuse longer codes starting with 0", () => {
      // UPC-A starting with 0 (not an EAN-8)
      expect(normalizeGtin("036000291452")).toBe("00036000291452");
    });

    it("should accept them with acceptRestricted", () => {
      const accept = { acceptRestricted: true };
      expect(normalizeGtin("21234569", accept)).toBe("00000021234569");
      expect(normalizeGtin(1_234_565, { ...accept, minLength: 7 })).toBe(
        "00000001234565"
      );
    });
  });

  describe("restricted circulation EAN-13 / UPC-A", () => {
    it.each([
      ["2000000000008", "02000000000008"],
      ["0412345678903", "00412345678903"],
      [212_345_678_992, "00212345678992"],
      [212_345_678_909, "00212345678909"],
    ])("should refuse %s unless acceptRestricted", (value, expected) => {
      expect(normalizeGtin(value)).toBeNull();
      expect(normalizeGtin(value, { acceptRestricted: true })).toBe(expected);
    });
  });

  describe("minLength option", () => {
    it("should never accept less than 8 significant digits", () => {
      expect(normalizeGtin(1_234_565, { minLength: 1 })).toBeNull();
    });

    it("should reject shorter values when minLength is raised", () => {
      expect(normalizeGtin(96_385_074, { minLength: 12 })).toBeNull();
      expect(normalizeGtin("036000291452", { minLength: 12 })).toBe(
        "00036000291452"
      );
    });

    it("should count leading zeros of strings", () => {
      expect(normalizeGtin("0036000291452", { minLength: 13 })).toBe(
        "00036000291452"
      );
      expect(normalizeGtin(36_000_291_452, { minLength: 13 })).toBeNull();
    });

    it.each([0, 15, 1.5, Number.NaN])(
      "should throw a RangeError for minLength %s",
      (minLength) => {
        expect(() => normalizeGtin("96385074", { minLength })).toThrow(
          RangeError
        );
      }
    );
  });

  it("should return a Gtin14", () => {
    expectTypeOf(normalizeGtin(1)).toEqualTypeOf<Gtin14 | null>();
  });
});

class HttpBadRequestError extends Error {
  override readonly name = "HttpBadRequestError";
}

describe("assertNormalizedGtin", () => {
  it("should return the normalized GTIN", () => {
    expect(assertNormalizedGtin(36_000_291_452)).toBe("00036000291452");
    expectTypeOf(assertNormalizedGtin).returns.toEqualTypeOf<Gtin14>();
  });

  it.each([
    [4_006_380_000_000, "number"],
    ["4006381333932", "string(length:13)"],
    ["21234569", "string(length:8)"],
    [null, "null"],
    [{}, "object"],
  ])("should throw a TypeError for %s", (value, typeInfo) => {
    expect(() => assertNormalizedGtin(value)).toThrow(
      new TypeError(`Value is expected to be a GTIN, got: ${typeInfo}`)
    );
  });

  it("should throw a TypeError with a custom message", () => {
    expect(() => assertNormalizedGtin(1, "Invalid barcode")).toThrow(
      new TypeError("Invalid barcode")
    );
  });

  it("should throw the error returned by the factory, with the value", () => {
    expect(() =>
      assertNormalizedGtin(
        12,
        (v) => new HttpBadRequestError(`Bad barcode (${typeof v})`)
      )
    ).toThrow(new HttpBadRequestError("Bad barcode (number)"));
  });

  it("should forward the options", () => {
    expect(() =>
      assertNormalizedGtin(96_385_074, undefined, { minLength: 12 })
    ).toThrow(TypeError);
    expect(() =>
      assertNormalizedGtin(96_385_074, undefined, { minLength: 0 })
    ).toThrow(RangeError);
    expect(() => assertNormalizedGtin("2123456789010")).toThrow(TypeError);
    expect(
      assertNormalizedGtin("2123456789010", undefined, {
        acceptRestricted: true,
      })
    ).toBe("02123456789010");
  });
});
