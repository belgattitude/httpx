import { describe, expect, it } from "vitest";

import { isEan13, isUpcA } from "../barcode-guards";
import { isRestrictedCirculation } from "../is-restricted-circulation";
import { normalizeGtin } from "../normalize-gtin";

describe("isRestrictedCirculation", () => {
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
    expect(isRestrictedCirculation(value)).toBe(true);
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
    expect(isRestrictedCirculation(value)).toBe(false);
  });

  it("should be an opt-in check: RCN-13 and UPC-A remain valid GTINs", () => {
    expect(isEan13("2123456789010")).toBe(true);
    expect(isUpcA("212345678992")).toBe(true);
    expect(normalizeGtin("2123456789010")).toBe("02123456789010");
  });

  it("should apply minLength like normalizeGtin", () => {
    // "01234565" with its leading zero lost
    expect(isRestrictedCirculation(1_234_565)).toBe(false);
    expect(isRestrictedCirculation(1_234_565, { minLength: 7 })).toBe(true);
    expect(isRestrictedCirculation(21_234_569, { minLength: 12 })).toBe(false);
    expect(() => isRestrictedCirculation("21234569", { minLength: 0 })).toThrow(
      RangeError
    );
  });
});
