import { describe, expect, expectTypeOf, it } from "vitest";

import { type BarcodeType, detectBarcodeType } from "../detect-barcode-type";

describe("detectBarcodeType", () => {
  it.each([
    ["96385074", "ean8"],
    ["73513537", "ean8"],
    ["036000291452", "upca"],
    ["012345678905", "upca"],
    ["4006381333931", "ean13"],
    ["5901234123457", "ean13"],
    ["0036000291452", "ean13"],
    ["10012345678902", "gtin14"],
    ["00012345678905", "gtin14"],
  ] as const)("should detect %s as %s", (code, expected) => {
    expect(detectBarcodeType(code)).toBe(expected);
  });

  it.each([
    ["96385075", "ean8 with wrong check digit"],
    ["01234565", "ean8 starting with 0 (restricted circulation)"],
    ["21234569", "ean8 starting with 2 (restricted circulation)"],
    ["000021234569", "restricted ean8 padded as upca"],
    ["036000291453", "upca with wrong check digit"],
    ["4006381333932", "ean13 with wrong check digit"],
    ["10012345678903", "gtin14 with wrong check digit"],
    ["1234567", "unsupported length (7)"],
    ["123456789", "unsupported length (9)"],
    ["123456789012345", "unsupported length (15)"],
    ["400638133393a", "non digit character"],
    [" 4006381333931", "leading space"],
    ["4006381333931 ", "trailing space"],
    ["400-6381333931", "dash"],
    ["", "empty string"],
  ])("should return null for %s (%s)", (code) => {
    expect(detectBarcodeType(code)).toBeNull();
  });

  it("should return a typed result", () => {
    expectTypeOf(
      detectBarcodeType("96385074")
    ).toEqualTypeOf<BarcodeType | null>();
  });
});
