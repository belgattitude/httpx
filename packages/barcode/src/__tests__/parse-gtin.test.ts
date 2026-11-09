import { describe, expect, expectTypeOf, it } from "vitest";

import { detectBarcodeType } from "../detect-barcode-type";
import { formatGtin } from "../format-gtin";
import { isInStoreGtin } from "../is-in-store-gtin";
import { normalizeGtin } from "../normalize-gtin";
import type {
  ParsedGtin,
  ParseGtinErrorReason,
  ParseGtinResult,
} from "../parse-gtin";
import { parseGtin, parseGtinOrThrow } from "../parse-gtin";
import type { Ean8, UpcA } from "../types";

/** Append the GS1 mod-10 check digit (reference implementation) */
const withCheckDigit = (payload: string): string => {
  let sum = 0;
  for (let i = payload.length - 1, w = 3; i >= 0; i--, w = 4 - w) {
    sum += Number(payload[i]) * w;
  }
  return `${payload}${(10 - (sum % 10)) % 10}`;
};

describe("parseGtin", () => {
  it.each([
    // [input, gtin, type, value, format, indicator]
    [36_000_291_452, "00036000291452", "upca", "036000291452", null, 0],
    ["36000291452", "00036000291452", "upca", "036000291452", null, 0],
    ["036000291452", "00036000291452", "upca", "036000291452", "upca", 0],
    ["0036000291452", "00036000291452", "upca", "036000291452", "ean13", 0],
    ["00036000291452", "00036000291452", "upca", "036000291452", "gtin14", 0],
    ["4006381333931", "04006381333931", "ean13", "4006381333931", "ean13", 0],
    [4_006_381_333_931n, "04006381333931", "ean13", "4006381333931", null, 0],
    ["04006381333931", "04006381333931", "ean13", "4006381333931", "gtin14", 0],
    ["96385074", "00000096385074", "ean8", "96385074", "ean8", 0],
    [96_385_074, "00000096385074", "ean8", "96385074", null, 0],
    ["0000096385074", "00000096385074", "ean8", "96385074", "ean13", 0],
    [
      "10012345678902",
      "10012345678902",
      "gtin14",
      "10012345678902",
      "gtin14",
      1,
    ],
    [10_012_345_678_902, "10012345678902", "gtin14", "10012345678902", null, 1],
  ] as const)(
    "should parse %s",
    (input, gtin, type, value, format, indicator) => {
      expect(parseGtin(input)).toStrictEqual({
        success: true,
        value,
        type,
        gtin,
        format,
        indicator,
        category: "trade_item",
      });
    }
  );

  it("should give the value formatGtin gives for the type length", () => {
    const lengths = { ean8: 8, upca: 12, ean13: 13, gtin14: 14 } as const;
    for (const value of [
      "0036000291452",
      "96385074",
      "10012345678902",
      4_006_381_333_931,
    ]) {
      const result = parseGtinOrThrow(value);
      expect(result.value).toBe(formatGtin(result.gtin, lengths[result.type]));
    }
  });

  it("should type the value according to the type", () => {
    const result = parseGtinOrThrow("036000291452");
    if (result.type === "upca") {
      expectTypeOf(result.value).toEqualTypeOf<UpcA>();
    }
    if (result.type === "ean8") {
      expectTypeOf(result.value).toEqualTypeOf<Ean8>();
    }
  });

  it.each([
    [{}, "invalid_type"],
    [null, "invalid_type"],
    [undefined, "invalid_type"],
    [true, "invalid_type"],
    [-4_006_381_333_931, "invalid_format"],
    [-4_006_381_333_931n, "invalid_format"],
    [4_006_381_333.931, "invalid_format"],
    [Number.NaN, "invalid_format"],
    [Number.POSITIVE_INFINITY, "invalid_format"],
    [Number.MAX_SAFE_INTEGER + 2, "invalid_format"],
    ["400638133393a", "invalid_format"],
    ["4006 381333931", "invalid_format"],
    ["   ", "invalid_length"],
    ["4006-381333931", "invalid_format"],
    ["-4006381333931", "invalid_format"],
    ["", "invalid_length"],
    ["1234565", "invalid_length"],
    [1_234_565, "invalid_length"],
    [1_234_565n, "invalid_length"],
    ["123456789012345", "invalid_length"],
    [100_123_456_789_028, "invalid_length"],
    ["40063813339a12", "invalid_format"],
    // non digit strings of an unsupported length: format, not length
    ["N/A", "invalid_format"],
    ["abcdefghijklmnopq", "invalid_format"],
    ["4006-381-333-931", "invalid_format"],
    ["4006381333932", "invalid_check_digit"],
    [4_006_380_000_000, "invalid_check_digit"],
  ] as const)("should refuse %s (%s)", (value, reason) => {
    expect(parseGtin(value)).toStrictEqual({ success: false, reason });
  });

  it("should agree with normalizeGtin", () => {
    const values = [
      36_000_291_452,
      "0036000291452",
      "4006381333932",
      "21234569",
      "2123456789010",
      "abc",
      4_006_381_333_931n,
      null,
    ];
    for (const value of values) {
      const result = parseGtin(value);
      expect(result.success ? result.gtin : null).toBe(normalizeGtin(value));
    }
  });

  it("should give the format detectBarcodeType gives", () => {
    for (const code of ["96385074", "036000291452", "4006381333931"]) {
      const result = parseGtin(code);
      expect(result.success && result.format).toBe(detectBarcodeType(code));
    }
  });

  it("should return frozen shared failures", () => {
    const result = parseGtin("4006381333932");
    expect(result).toBe(parseGtin(4_006_380_000_000));
    expect(Object.isFrozen(result)).toBe(true);
  });

  describe("in-store codes (restricted circulation numbers)", () => {
    it.each([
      ["2123456789010", "02123456789010", "ean13"],
      ["21234569", "00000021234569", "ean8"],
      ["01234565", "00000001234565", "ean8"],
      [212_345_678_909, "00212345678909", "upca"],
      ["212345678992", "00212345678992", "upca"],
    ] as const)(
      "should accept %s by default and flag it",
      (value, gtin, type) => {
        expect(parseGtin(value)).toMatchObject({
          success: true,
          gtin,
          value: gtin.slice(14 - { ean8: 8, upca: 12, ean13: 13 }[type]),
          type,
          category: "in_store",
        });
      }
    );

    it("should agree with isInStoreGtin", () => {
      for (const value of [
        "2123456789010",
        "0412345678903",
        "21234569",
        "4006381333931",
        "96385074",
        "9781861972712",
      ]) {
        const result = parseGtin(value);
        expect(result.success && result.category === "in_store").toBe(
          isInStoreGtin(value)
        );
      }
    });

    it("should still refuse invalid check digits", () => {
      expect(parseGtin("2123456789011")).toStrictEqual({
        success: false,
        reason: "invalid_check_digit",
      });
    });

    it("should refuse them with categories", () => {
      expect(
        parseGtin("2123456789010", { categories: ["trade_item", "isbn"] })
      ).toStrictEqual({ success: false, reason: "invalid_category" });
      expect(
        parseGtin("2123456789010", { categories: ["in_store"] }).success
      ).toBe(true);
      expect(
        parseGtin("4006381333931", { categories: ["in_store"] })
      ).toStrictEqual({ success: false, reason: "invalid_category" });
    });

    it("should ignore acceptRestricted (not an option anymore)", () => {
      const options = { acceptRestricted: false } as object;
      expect(parseGtin("2123456789010", options)).toMatchObject({
        success: true,
        category: "in_store",
      });
    });
  });

  describe("category", () => {
    it.each([
      ["4006381333931", "trade_item"],
      [36_000_291_452, "trade_item"],
      ["96385074", "trade_item"],
      ["9781861972712", "isbn"],
      [withCheckDigit("979103430444"), "isbn"],
      [withCheckDigit("979006011561"), "ismn"],
      [withCheckDigit("977123456700"), "issn"],
      [withCheckDigit("980000000000"), "refund_receipt"],
      [withCheckDigit("981000000000"), "coupon"],
      [withCheckDigit("984000000000"), "coupon"],
      [withCheckDigit("985000000000"), "trade_item"],
      [withCheckDigit("990000000000"), "coupon"],
      // UPC-A number system 5 ("05" as EAN-13)
      [withCheckDigit("51000012517"), "coupon"],
      [`0${withCheckDigit("51000012517")}`, "coupon"],
      // UPC-A number system 0 (regular)
      ["051000012517", "trade_item"],
      [withCheckDigit("1978186197271"), "isbn"],
      ["10012345678902", "trade_item"],
    ] as const)("should classify %s as %s", (value, category) => {
      expect(parseGtin(value)).toMatchObject({ success: true, category });
    });

    it.each([
      ["2123456789010", "ean13"],
      ["0412345678903", "upca"],
      ["21234569", "ean8"],
      ["212345678992", "upca"],
    ] as const)(
      "should classify the restricted circulation number %s as in_store",
      (value, type) => {
        expect(parseGtin(value)).toMatchObject({
          success: true,
          type,
          category: "in_store",
        });
      }
    );

    it("should refuse categories not listed", () => {
      const categories = ["trade_item"] as const;
      expect(parseGtin("4006381333931", { categories }).success).toBe(true);
      expect(parseGtin("9781861972712", { categories })).toStrictEqual({
        success: false,
        reason: "invalid_category",
      });
      expect(
        parseGtin("9781861972712", { categories: ["isbn", "ismn"] }).success
      ).toBe(true);
    });
  });

  describe("types option", () => {
    const types = ["ean13", "upca"] as const;

    it.each([
      ["4006381333931", "ean13"],
      ["036000291452", "upca"],
      ["0036000291452", "upca (given as ean13)"],
      [36_000_291_452, "upca (number)"],
    ])("should accept %s (%s)", (value, _type) => {
      expect(parseGtin(value, { types }).success).toBe(true);
    });

    it.each([
      ["96385074", "ean8"],
      ["0000096385074", "ean8 given as ean13"],
      ["10012345678902", "gtin14 with indicator"],
    ])("should refuse %s (%s)", (value, _type) => {
      expect(parseGtin(value, { types })).toStrictEqual({
        success: false,
        reason: "invalid_barcode_type",
      });
    });

    it("should report other reasons first", () => {
      expect(parseGtin("4006381333932", { types: ["ean8"] })).toStrictEqual({
        success: false,
        reason: "invalid_check_digit",
      });
      expect(parseGtin("2123456789011", { types: ["ean8"] })).toStrictEqual({
        success: false,
        reason: "invalid_check_digit",
      });
    });
  });

  describe("trim option", () => {
    it.each([
      " 4006381333931",
      "4006381333931 ",
      "\t4006381333931\r\n",
      "\u00A04006381333931\u00A0",
      "\uFEFF4006381333931",
    ])("should trim %j by default", (value) => {
      expect(parseGtin(value)).toMatchObject({
        success: true,
        gtin: "04006381333931",
        value: "4006381333931",
        format: "ean13",
      });
    });

    it("should apply minLength to the trimmed string", () => {
      expect(parseGtin(" 96385074 ", { minLength: 10 })).toStrictEqual({
        success: false,
        reason: "invalid_length",
      });
    });

    it("should refuse whitespace when trim is false", () => {
      expect(parseGtin(" 4006381333931", { trim: false })).toStrictEqual({
        success: false,
        reason: "invalid_format",
      });
      expect(() =>
        parseGtinOrThrow("4006381333931\n", undefined, { trim: false })
      ).toThrow(/invalid_format/);
    });
  });

  describe("inputTypes option", () => {
    it("should refuse values of other types", () => {
      const inputTypes = ["string"] as const;
      expect(parseGtin("036000291452", { inputTypes }).success).toBe(true);
      expect(parseGtin(36_000_291_452, { inputTypes })).toStrictEqual({
        success: false,
        reason: "invalid_type",
      });
      expect(parseGtin(36_000_291_452n, { inputTypes }).success).toBe(false);
    });

    it("should accept numbers and bigints when listed", () => {
      const inputTypes = ["number", "bigint"] as const;
      expect(parseGtin(36_000_291_452, { inputTypes }).success).toBe(true);
      expect(parseGtin(36_000_291_452n, { inputTypes }).success).toBe(true);
      expect(parseGtin("036000291452", { inputTypes }).success).toBe(false);
    });
  });

  describe("minLength option", () => {
    it("should refuse shorter inputs", () => {
      expect(parseGtin(96_385_074, { minLength: 12 })).toStrictEqual({
        success: false,
        reason: "invalid_length",
      });
    });

    it.each([0, 15, 1.5])("should throw a RangeError for %s", (minLength) => {
      expect(() => parseGtin("96385074", { minLength })).toThrow(RangeError);
      expect(() => parseGtin(1, { minLength, inputTypes: ["string"] })).toThrow(
        RangeError
      );
    });
  });

  it("should narrow on success", () => {
    const result = parseGtin("4006381333931");
    expectTypeOf(result).toEqualTypeOf<ParseGtinResult>();
    if (result.success) {
      expectTypeOf(result).toEqualTypeOf<ParsedGtin>();
    } else {
      expectTypeOf(result.reason).toEqualTypeOf<ParseGtinErrorReason>();
    }
  });
});

class HttpBadRequestError extends Error {
  override readonly name = "HttpBadRequestError";
}

describe("parseGtinOrThrow", () => {
  it("should return the parsed GTIN", () => {
    const { gtin, type } = parseGtinOrThrow(36_000_291_452);
    expect(gtin).toBe("00036000291452");
    expect(type).toBe("upca");
    expectTypeOf(parseGtinOrThrow).returns.toEqualTypeOf<ParsedGtin>();
  });

  it.each([
    [4_006_380_000_000, "invalid_check_digit", "number"],
    ["4006381333932", "invalid_check_digit", "string(length:13)"],
    ["123", "invalid_length", "string(length:3)"],
    [null, "invalid_type", "null"],
    [{}, "invalid_type", "object"],
  ])("should throw a TypeError for %s", (value, reason, typeInfo) => {
    expect(() => parseGtinOrThrow(value)).toThrow(
      new TypeError(
        `Value is expected to be a GTIN (${reason}), got: ${typeInfo}`
      )
    );
  });

  it("should throw a TypeError with a custom message", () => {
    expect(() => parseGtinOrThrow(1, "Invalid barcode")).toThrow(
      new TypeError("Invalid barcode")
    );
  });

  it("should throw the error returned by the factory, with value and reason", () => {
    expect(() =>
      parseGtinOrThrow(
        "4006381333932",
        (v, reason) => new HttpBadRequestError(`${typeof v}: ${reason}`)
      )
    ).toThrow(new HttpBadRequestError("string: invalid_check_digit"));
  });

  it("should forward the options", () => {
    expect(() =>
      parseGtinOrThrow("96385074", undefined, { types: ["ean13"] })
    ).toThrow(/invalid_barcode_type/);
    expect(
      parseGtinOrThrow("2123456789010", undefined, { types: ["ean13"] })
        .category
    ).toBe("in_store");
    expect(() =>
      parseGtinOrThrow("2123456789010", undefined, {
        categories: ["trade_item"],
      })
    ).toThrow(/invalid_category/);
    expect(() =>
      parseGtinOrThrow(96_385_074, undefined, { minLength: 0 })
    ).toThrow(RangeError);
  });
});

describe("parseGtin formats", () => {
  it.each([
    ["036000291452", ["upca"], "upca"],
    ["0036000291452", ["ean13"], "ean13"],
    ["00036000291452", ["gtin14", "ean13"], "gtin14"],
    ["96385074", ["ean8"], "ean8"],
    [" 4006381333931\n", ["ean13"], "ean13"],
  ] as const)("should accept %j with %j", (value, formats, format) => {
    expect(parseGtin(value, { formats })).toMatchObject({
      success: true,
      format,
    });
  });

  it("should match the format as given, not the GS1 type", () => {
    // UPC-A as EAN-13: type "upca", format "ean13"
    expect(parseGtin("0036000291452", { formats: ["upca"] })).toStrictEqual({
      success: false,
      reason: "format_not_accepted",
    });
    expect(
      parseGtin("0036000291452", { formats: ["ean13"], types: ["upca"] })
    ).toMatchObject({ success: true, type: "upca", format: "ean13" });
  });

  it.each([
    ["number", 36_000_291_452],
    ["bigint", 36_000_291_452n],
    ["11 digit string", "36000291452"],
  ])("should refuse a %s (unknown format)", (_label, value) => {
    expect(parseGtin(value)).toMatchObject({ success: true, format: null });
    expect(
      parseGtin(value, { formats: ["ean8", "upca", "ean13", "gtin14"] })
    ).toStrictEqual({ success: false, reason: "format_not_accepted" });
  });

  it("should accept or refuse UPC-E", () => {
    // UPC-E excluded, UPC-A accepted
    const options = {
      upce: "prefer-upce",
      formats: ["upca", "ean13"],
    } as const;
    expect(parseGtin("04252614", options)).toStrictEqual({
      success: false,
      reason: "format_not_accepted",
    });
    expect(parseGtin("042100005264", options)).toMatchObject({
      success: true,
    });
    // UPC-E only
    expect(
      parseGtin("04252614", { upce: true, formats: ["upce"] })
    ).toMatchObject({
      success: true,
      value: "042100005264",
      format: "upce",
    });
    expect(
      parseGtin("042100005264", { upce: true, formats: ["upce"] })
    ).toStrictEqual({ success: false, reason: "format_not_accepted" });
  });

  it("should read UPC-E (auto) when formats lists upce", () => {
    expect(parseGtin("04252614", { formats: ["upce"] })).toMatchObject({
      success: true,
      value: "042100005264",
      format: "upce",
    });
    expect(parseGtin("04252614", { formats: ["upce", "ean8"] })).toStrictEqual(
      parseGtin("04252614", { upce: "prefer-upce" })
    );
    // auto: valid as both stays an EAN-8
    expect(parseGtin("10000168", { formats: ["upce"] })).toStrictEqual({
      success: false,
      reason: "format_not_accepted",
    });
    expect(
      parseGtin("10000168", { formats: ["upce"], upce: true })
    ).toMatchObject({ success: true, format: "upce" });
    // explicit upce: false wins, 8 digits are only read as EAN-8
    expect(
      parseGtin("04252614", { formats: ["upce"], upce: false })
    ).toStrictEqual({ success: false, reason: "invalid_check_digit" });
    // not listed: 8 digits stay EAN-8
    expect(parseGtin("04252614", { formats: ["ean8"] })).toStrictEqual({
      success: false,
      reason: "invalid_check_digit",
    });
    // numbers are never read as UPC-E
    expect(parseGtin(4_252_614, { formats: ["upce"] })).toStrictEqual({
      success: false,
      reason: "invalid_length",
    });
  });

  it("should check formats after types and before categories", () => {
    expect(
      parseGtin("96385074", { types: ["ean13"], formats: ["ean13"] })
    ).toStrictEqual({ success: false, reason: "invalid_barcode_type" });
    expect(
      parseGtin("9781861972712", {
        formats: ["upca"],
        categories: ["trade_item"],
      })
    ).toStrictEqual({ success: false, reason: "format_not_accepted" });
  });

  it("should throw with the reason", () => {
    expect(() =>
      parseGtinOrThrow("036000291452", undefined, { formats: ["ean13"] })
    ).toThrow(
      new TypeError(
        "Value is expected to be a GTIN (format_not_accepted), got: string(length:12)"
      )
    );
  });
});
