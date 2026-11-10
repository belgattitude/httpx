import { describe, expect, it } from "vitest";

import { getBarcodeSeeds } from "../../bench/bench-seeds";
import { isEan8, isEan13, isGtin14, isUpcA } from "../barcode-guards";
import { detectBarcodeType } from "../detect-barcode-type";
import { isGtin } from "../is-gtin";
import { isInStoreGtin } from "../is-in-store-gtin";
import { normalizeGtin } from "../normalize-gtin";
import { parseGtin } from "../parse-gtin";

describe("isInStoreGtin", () => {
  it.each([
    // EAN-13 GS1 Prefix 20-29 (geographic region)
    ["2123456789010", "ean13 starting with 21"],
    ["2912345678906", "ean13 starting with 29"],
    ["2000000000008", "ean13 starting with 20"],
    // EAN-13 GS1 Prefix 02 (geographic region) and 04 (company internal)
    ["0212345678909", "ean13 starting with 02"],
    ["0412345678903", "ean13 starting with 04"],
    // UPC-A starting with 2 or 4 (same as ean13 02 / 04)
    ["212345678992", "upca starting with 2"],
    ["412345678996", "upca starting with 4"],
    // EAN-8 GS1-8 Prefix 0 and 2
    ["21234569", "ean8 starting with 2"],
    ["01234565", "ean8 starting with 0"],
    // GTIN-14 containing a RCN
    ["02123456789010", "gtin14, indicator 0"],
    ["12123456789017", "gtin14, indicator 1"],
    // leading zeros lost
    [212_345_678_992, "upca as number"],
    [212_345_678_909, "ean13 02... as number (leading zero lost)"],
    [21_234_569, "ean8 as number"],
    [2_123_456_789_010n, "bigint"],
  ])("should return true for %s (%s)", (value, _reason) => {
    expect(isInStoreGtin(value)).toBe(true);
  });

  it.each([
    ["4006381333931", "ean13 (Germany)"],
    ["3012345678902", "ean13 starting with 30"],
    ["4012345678901", "ean13 starting with 40"],
    ["0036000291452", "ean13 starting with 00 (GS1 US)"],
    ["036000291452", "upca starting with 0"],
    ["512345678993", "upca starting with 5 (coupons, not RCN)"],
    ["96385074", "ean8 starting with 9"],
    ["14006381333938", "gtin14 of a regular ean13"],
    ["2123456789011", "invalid check digit"],
    ["212345678993", "invalid check digit (upca)"],
    ["21234568", "invalid check digit (ean8)"],
    ["212345678901a", "non digit"],
    ["", "empty"],
    [-212_345_678_992, "negative"],
    [null, "null"],
    [{}, "object"],
  ])("should return false for %s (%s)", (value, _reason) => {
    expect(isInStoreGtin(value)).toBe(false);
  });

  it("should be valid GTINs for the other functions", () => {
    expect(isEan13("2123456789010")).toBe(true);
    expect(isUpcA("212345678992")).toBe(true);
    expect(normalizeGtin("2123456789010")).toBe("02123456789010");
    expect(parseGtin("2123456789010")).toMatchObject({ category: "in_store" });
  });

  it("should agree with the guards on every generated code", () => {
    const codes = [
      ...getBarcodeSeeds(5000),
      // make sure every range is covered
      "2123456789010",
      "0212345678909",
      "0412345678903",
      "212345678992",
      "412345678996",
      "21234569",
      "01234565",
      "02123456789010",
      "12123456789017",
      "00000021234569",
      "0000021234569",
      "000021234569",
    ];
    let restricted = 0;
    for (const code of codes) {
      const isRcn = isInStoreGtin(code);
      restricted += isRcn ? 1 : 0;
      // the in_store category of parseGtin, only for valid codes
      const parsed = parseGtin(code);
      expect([
        code,
        parsed.success && parsed.category === "in_store",
      ]).toStrictEqual([code, isRcn]);
      expect(!isRcn || normalizeGtin(code) !== null).toBe(true);
      const guards = [isEan8, isUpcA, isEan13, isGtin14];
      expect(guards.some((guard) => guard(code))).toBe(isGtin(code));
      expect(detectBarcodeType(code) !== null).toBe(isGtin(code));
    }
    expect(restricted).toBeGreaterThan(100);
  });

  it("should only trim with trim: true", () => {
    expect(isInStoreGtin(" 2123456789010\n")).toBe(false);
    expect(isInStoreGtin(" 2123456789010", { trim: false })).toBe(false);
    expect(isInStoreGtin(" 2123456789010\n", { trim: true })).toBe(true);
  });

  it("should apply minLength like normalizeGtin", () => {
    // "01234565" with its leading zero lost
    expect(isInStoreGtin(1_234_565)).toBe(false);
    expect(isInStoreGtin(1_234_565, { minLength: 7 })).toBe(true);
    expect(isInStoreGtin(21_234_569, { minLength: 12 })).toBe(false);
    expect(() => isInStoreGtin("21234569", { minLength: 0 })).toThrow(
      RangeError
    );
  });
});
