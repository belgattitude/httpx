import { describe, expect, it } from "vitest";

import { isGtin } from "../is-gtin";

describe("isGtin", () => {
  it.each([
    ["96385074", "GTIN-8"],
    ["036000291452", "GTIN-12 (UPC-A)"],
    ["4006381333931", "GTIN-13 (EAN-13)"],
    ["5901234123457", "GTIN-13 (EAN-13)"],
    ["10012345678902", "GTIN-14"],
  ])("should return true for valid %s (%s)", (code) => {
    expect(isGtin(code)).toBe(true);
  });

  it.each([
    ["4006381333932", "wrong check digit"],
    ["036000291453", "wrong check digit"],
    ["400638133393", "wrong check digit for its length"],
    ["1234567", "unsupported length"],
    ["123456789", "unsupported length"],
    ["400638133393a", "non digit character"],
    [" 4006381333931", "leading space"],
    ["", "empty string"],
  ])("should return false for %s (%s)", (code) => {
    expect(isGtin(code)).toBe(false);
  });
});
