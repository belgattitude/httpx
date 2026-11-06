import { describe, expect, expectTypeOf, it } from "vitest";

import { formatGtin } from "../format-gtin";
import { normalizeGtin } from "../normalize-gtin";
import type { Ean8, Ean13, Gtin14, UpcA } from "../types";

describe("formatGtin", () => {
  it.each([
    // strip leading zeros
    ["00036000291452", 12, "036000291452"],
    ["00036000291452", 13, "0036000291452"],
    ["00000096385074", 8, "96385074"],
    ["0036000291452", 12, "036000291452"],
    // pad
    ["036000291452", 13, "0036000291452"],
    ["036000291452", 14, "00036000291452"],
    ["96385074", 14, "00000096385074"],
    ["96385074", 12, "000096385074"],
    // same length
    ["4006381333931", 13, "4006381333931"],
    ["10012345678902", 14, "10012345678902"],
  ] as const)("should format %s to length %s: %s", (gtin, length, expected) => {
    expect(formatGtin(gtin, length)).toBe(expected);
  });

  it.each([
    ["04006381333931", 12, "would drop a non-zero digit"],
    ["10012345678902", 13, "would drop the indicator digit"],
    ["4006381333931", 8, "would drop non-zero digits"],
    ["4006381333932", 13, "invalid check digit"],
    ["36000291452", 12, "unsupported input length (11)"],
    ["400638133393a", 13, "non digit"],
    ["", 13, "empty"],
    ["00000021234569", 8, "restricted circulation ean8"],
    ["21234569", 14, "restricted circulation ean8"],
  ] as const)(
    "should return null for %s to %s (%s)",
    (gtin, length, _reason) => {
      expect(formatGtin(gtin, length)).toBeNull();
    }
  );

  it("should format restricted circulation numbers with acceptRestricted", () => {
    expect(formatGtin("2123456789010", 14)).toBeNull();
    expect(formatGtin("2123456789010", 14, { acceptRestricted: true })).toBe(
      "02123456789010"
    );
    expect(formatGtin("00000021234569", 8, { acceptRestricted: true })).toBe(
      "21234569"
    );
  });

  it("should round-trip with normalizeGtin", () => {
    const normalized = normalizeGtin(36_000_291_452);
    expect(normalized).not.toBeNull();
    expect(formatGtin(normalized ?? "", 12)).toBe("036000291452");
  });

  it("should return the branded type of the requested length", () => {
    expectTypeOf(formatGtin("", 8)).toEqualTypeOf<Ean8 | null>();
    expectTypeOf(formatGtin("", 12)).toEqualTypeOf<UpcA | null>();
    expectTypeOf(formatGtin("", 13)).toEqualTypeOf<Ean13 | null>();
    expectTypeOf(formatGtin("", 14)).toEqualTypeOf<Gtin14 | null>();
  });
});
