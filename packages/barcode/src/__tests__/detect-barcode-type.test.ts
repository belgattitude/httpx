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
    ["400-6381333931", "dash"],
    ["", "empty string"],
  ])("should return null for %s (%s)", (code) => {
    expect(detectBarcodeType(code)).toBeNull();
  });

  it.each([
    ["2123456789010", "ean13"],
    ["0412345678903", "ean13"],
    ["212345678992", "upca"],
    ["21234569", "ean8"],
    ["01234565", "ean8"],
    ["12123456789017", "gtin14"],
  ] as const)(
    "should detect restricted %s as %s only with acceptRestricted",
    (code, expected) => {
      expect(detectBarcodeType(code)).toBeNull();
      expect(detectBarcodeType(code, { acceptRestricted: true })).toBe(
        expected
      );
    }
  );

  describe("trim option", () => {
    it.each([
      " 4006381333931",
      "4006381333931 ",
      "\t4006381333931\r\n",
      "\u00A04006381333931",
      "\uFEFF4006381333931",
    ])("should trim %j by default", (code) => {
      expect(detectBarcodeType(code)).toBe("ean13");
    });

    it.each([" 4006381333931", "4006381333931 ", "4006381333931\n"])(
      "should refuse %j with trim: false",
      (code) => {
        expect(detectBarcodeType(code, { trim: false })).toBeNull();
      }
    );

    it("should not trim inner whitespace", () => {
      expect(detectBarcodeType("4006 381333931")).toBeNull();
      expect(detectBarcodeType("   ")).toBeNull();
    });
  });

  it("should return null for non strings", () => {
    expect(
      detectBarcodeType(4_006_381_333_931 as unknown as string)
    ).toBeNull();
  });

  it("should return a typed result", () => {
    expectTypeOf(
      detectBarcodeType("96385074")
    ).toEqualTypeOf<BarcodeType | null>();
  });
});
