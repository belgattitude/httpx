import { describe, expect, expectTypeOf, it } from "vitest";

import type { GtinParserOptions } from "../create-gtin-parser";
import { createGtinParser } from "../create-gtin-parser";
import type { BarcodeType } from "../detect-barcode-type";
import type {
  GtinCategory,
  ParsedGtin,
  ParseGtinErrorReason,
  ParseGtinOptions,
  ParseGtinResult,
} from "../parse-gtin";
import { parseGtin } from "../parse-gtin";
import type { Ean13, Gtin14, UpcA } from "../types";

class HttpBadRequestError extends Error {
  override readonly name = "HttpBadRequestError";
}

type Parsed<TParser extends { parseOrThrow: (v: unknown) => unknown }> =
  ReturnType<TParser["parseOrThrow"]>;

describe("createGtinParser", () => {
  it("should parse like parseGtin with the default options", () => {
    const parser = createGtinParser();
    for (const value of [
      "4006381333931",
      36_000_291_452,
      "9781861972712",
      "4006381333932",
      "2123456789010",
      null,
    ]) {
      expect(parser.parse(value)).toStrictEqual(parseGtin(value));
    }
  });

  it("should apply its options", () => {
    const parser = createGtinParser({
      types: ["ean13", "upca"],
      categories: ["trade_item"],
      inputTypes: ["string"],
    });
    expect(parser.parse("4006381333931")).toMatchObject({ success: true });
    expect(parser.parse("96385074")).toStrictEqual({
      success: false,
      reason: "invalid_barcode_type",
    });
    expect(parser.parse("9781861972712")).toStrictEqual({
      success: false,
      reason: "invalid_category",
    });
    expect(parser.parse(4_006_381_333_931)).toStrictEqual({
      success: false,
      reason: "invalid_type",
    });
  });

  it("should be safe to pass methods as callbacks", () => {
    const parser = createGtinParser({ types: ["ean13"] });
    const results = ["4006381333931", "96385074"].map(parser.parse);
    expect(results.map((r) => r.success)).toStrictEqual([true, false]);
    const { parseOrThrow } = parser;
    expect(parseOrThrow("4006381333931").value).toBe("4006381333931");
  });

  it("should copy the options (later changes don't apply)", () => {
    const types: BarcodeType[] = ["ean13"];
    const options: ParseGtinOptions = { types, trim: true };
    const parser = createGtinParser(options);
    types.push("ean8");
    options.trim = false;
    expect(parser.parse("96385074").success).toBe(false);
    expect(parser.parse(" 4006381333931").success).toBe(true);
    expect(Object.isFrozen(parser.options)).toBe(true);
    expect(Object.isFrozen(parser.options.types)).toBe(true);
  });

  it("should validate minLength at creation", () => {
    expect(() => createGtinParser({ minLength: 0 })).toThrow(RangeError);
    expect(() => createGtinParser({ minLength: 15 })).toThrow(RangeError);
  });

  it("should return a frozen parser", () => {
    const parser = createGtinParser();
    expect(Object.isFrozen(parser)).toBe(true);
    expect(Object.isFrozen(parser.extend({ trim: false }))).toBe(true);
  });

  describe("parseOrThrow", () => {
    it("should return the parsed GTIN", () => {
      expect(createGtinParser().parseOrThrow(36_000_291_452)).toMatchObject({
        value: "036000291452",
        type: "upca",
      });
    });

    it("should throw a TypeError by default", () => {
      expect(() => createGtinParser().parseOrThrow("4006381333932")).toThrow(
        new TypeError(
          "Value is expected to be a GTIN (invalid_check_digit), got: string(length:13)"
        )
      );
    });

    it("should throw the errorFactory error with the value and reason", () => {
      const parser = createGtinParser({
        categories: ["trade_item"],
        errorFactory: (v, reason) =>
          new HttpBadRequestError(`${typeof v}: ${reason}`),
      });
      expect(() => parser.parseOrThrow("9781861972712")).toThrow(
        new HttpBadRequestError("string: invalid_category")
      );
    });

    it("should accept a message", () => {
      const parser = createGtinParser({ errorFactory: "Invalid barcode" });
      expect(() => parser.parseOrThrow("x")).toThrow(
        new TypeError("Invalid barcode")
      );
    });
  });

  describe("extend", () => {
    it("should merge options over the current ones", () => {
      const parser = createGtinParser({
        types: ["ean13"],
        errorFactory: "Invalid barcode",
      });
      const lenient = parser.extend({ acceptRestricted: true });
      expect(lenient.parse("2123456789010")).toMatchObject({
        success: true,
        category: "restricted",
      });
      expect(lenient.parse("96385074").success).toBe(false);
      expect(() => lenient.parseOrThrow("x")).toThrow("Invalid barcode");
      // the original parser is unchanged
      expect(parser.parse("2123456789010").success).toBe(false);
    });

    it("should type inline errorFactory callbacks", () => {
      const parser = createGtinParser().extend({
        types: ["ean13"],
        errorFactory: (v, reason) => {
          expectTypeOf(reason).toEqualTypeOf<ParseGtinErrorReason>();
          return new HttpBadRequestError(`${typeof v}: ${reason}`);
        },
      });
      expect(() => parser.parseOrThrow("96385074")).toThrow(
        new HttpBadRequestError("string: invalid_barcode_type")
      );
    });

    it("should replace an option", () => {
      const parser = createGtinParser({ types: ["ean13"] }).extend({
        types: ["ean8"],
      });
      expect(parser.parse("96385074").success).toBe(true);
      expect(parser.parse("4006381333931").success).toBe(false);
    });
  });

  describe("types", () => {
    it("should not narrow the types without options", () => {
      expectTypeOf(createGtinParser().parse).returns.toEqualTypeOf<
        ParseGtinResult<BarcodeType, Exclude<GtinCategory, "restricted">>
      >();
    });

    it("should narrow value, type and category from the options", () => {
      const parser = createGtinParser({
        types: ["ean13", "upca"],
        categories: ["trade_item", "isbn"],
      });
      type Result = Parsed<typeof parser>;
      expectTypeOf<Result["type"]>().toEqualTypeOf<"ean13" | "upca">();
      expectTypeOf<Result["value"]>().toEqualTypeOf<Ean13 | UpcA>();
      expectTypeOf<Result["category"]>().toEqualTypeOf<"trade_item" | "isbn">();
      expectTypeOf<Result["gtin"]>().toEqualTypeOf<Gtin14>();
      expectTypeOf<
        Extract<Result, { type: "upca" }>["value"]
      >().toEqualTypeOf<UpcA>();
    });

    it("should include restricted only with acceptRestricted", () => {
      const accept = createGtinParser({ acceptRestricted: true });
      expectTypeOf<
        Parsed<typeof accept>["category"]
      >().toEqualTypeOf<GtinCategory>();
      const refuse = createGtinParser({ acceptRestricted: false });
      expectTypeOf<Parsed<typeof refuse>["category"]>().toEqualTypeOf<
        Exclude<GtinCategory, "restricted">
      >();
      // non literal options: can't be narrowed
      const options: GtinParserOptions = { errorFactory: "Invalid" };
      const wide = createGtinParser(options);
      expectTypeOf<
        Parsed<typeof wide>["category"]
      >().toEqualTypeOf<GtinCategory>();
    });

    it("should narrow extended parsers from the merged options", () => {
      const parser = createGtinParser({ types: ["ean13"] }).extend({
        types: ["ean8"],
        acceptRestricted: true,
      });
      expectTypeOf<Parsed<typeof parser>["type"]>().toEqualTypeOf<"ean8">();
      expectTypeOf<
        Parsed<typeof parser>["category"]
      >().toEqualTypeOf<GtinCategory>();
    });

    it("should keep the default ParsedGtin unchanged", () => {
      expectTypeOf<ParsedGtin>().toEqualTypeOf<
        ParsedGtin<"ean8" | "upca" | "ean13" | "gtin14">
      >();
    });
  });
});
