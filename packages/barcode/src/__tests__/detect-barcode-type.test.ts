import { describe, expect, expectTypeOf, it } from "vitest";

import { type BarcodeType, detectBarcodeType } from "../detect-barcode-type";
import { isInStoreGtin } from "../is-in-store-gtin";
import { parseGtin } from "../parse-gtin";

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
    ["000021234569", "upca"],
    ["12123456789017", "gtin14"],
  ] as const)(
    "should detect the in-store code %s as %s (restricted circulation)",
    (code, expected) => {
      expect(isInStoreGtin(code)).toBe(true);
      expect(detectBarcodeType(code)).toBe(expected);
      // like parseGtin (format as given)
      expect(parseGtin(code)).toMatchObject({
        format: expected,
        category: "in_store",
      });
    }
  );

  it("should ignore acceptRestricted (not an option anymore)", () => {
    const options = { acceptRestricted: false } as object;
    expect(detectBarcodeType("2123456789010", options)).toBe("ean13");
  });

  it.each([
    " 4006381333931",
    "4006381333931 ",
    "\t4006381333931\r\n",
    "4006 381333931",
    "   ",
  ])("should never trim %j (validates the value as is)", (code) => {
    expect(detectBarcodeType(code)).toBeNull();
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
