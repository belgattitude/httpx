import { describe, expect, expectTypeOf, it } from "vitest";

import { isEan8, isEan13, isGtin14, isUpcA } from "../barcode-guards";
import { isGtin } from "../is-gtin";
import type { Ean8, Ean13, Gtin, Gtin14, UpcA } from "../types";

const valid = {
  ean13: ["4006381333931", "5901234123457", "0036000291452"],
  ean8: ["96385074", "73513537"],
  upca: ["036000291452", "012345678905"],
  gtin14: ["10012345678902", "00012345678905"],
} as const;

const invalid = [
  "01234565", // ean8 starting with 0 (restricted circulation)
  "21234569", // ean8 starting with 2 (restricted circulation)
  "000021234569", // same, padded as upca
  "0000021234569", // same, padded as ean13
  "00000021234569", // same, padded as gtin14
  "4006381333932", // ean13, wrong check digit
  "96385075", // ean8, wrong check digit
  "036000291453", // upca, wrong check digit
  "10012345678903", // gtin14, wrong check digit
  "400638133393a",
  " 4006381333931",
  "",
  4_006_381_333_931,
  null,
  undefined,
  {},
] as const;

const guards = {
  ean13: isEan13,
  ean8: isEan8,
  upca: isUpcA,
  gtin14: isGtin14,
} as const;

describe("barcode guards", () => {
  describe.each(Object.entries(guards))("%s guard", (type, guard) => {
    it.each(
      Object.entries(valid).flatMap(([t, codes]) =>
        codes.map((c) => [t, c] as const)
      )
    )("should match its own type only (%s: %s)", (codeType, code) => {
      expect(guard(code)).toBe(codeType === type);
    });

    it.each(invalid)("should return false for %s", (v) => {
      expect(guard(v)).toBe(false);
    });
  });

  it("isGtin should accept every type and reject invalid values", () => {
    for (const code of Object.values(valid).flat()) {
      expect(isGtin(code)).toBe(true);
    }
    for (const v of invalid) {
      expect(isGtin(v)).toBe(false);
    }
  });

  it("should narrow unknown values to branded types", () => {
    const v: unknown = "4006381333931";
    if (isEan13(v)) {
      expectTypeOf(v).toEqualTypeOf<Ean13>();
    }
    if (isEan8(v)) {
      expectTypeOf(v).toEqualTypeOf<Ean8>();
    }
    if (isUpcA(v)) {
      expectTypeOf(v).toEqualTypeOf<UpcA>();
    }
    if (isGtin14(v)) {
      expectTypeOf(v).toEqualTypeOf<Gtin14>();
    }
    if (isGtin(v)) {
      expectTypeOf(v).toEqualTypeOf<Gtin>();
    }
  });

  it("should keep branded types distinct and assignable to string", () => {
    expectTypeOf<Ean13>().toExtend<string>();
    expectTypeOf<Ean13>().not.toEqualTypeOf<Ean8>();
    expectTypeOf<string>().not.toExtend<Ean13>();
    expectTypeOf<Ean13>().toExtend<Gtin>();
  });
});
