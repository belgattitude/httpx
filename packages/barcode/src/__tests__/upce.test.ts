import { describe, expect, expectTypeOf, it } from "vitest";

import { assertUpcE } from "../barcode-asserts";
import { isUpcA, isUpcE } from "../barcode-guards";
import { detectBarcodeType } from "../detect-barcode-type";
import { parseGtin } from "../parse-gtin";
import type { UpcA, UpcE } from "../types";
import { compressUpcA, expandUpcE } from "../upce";

/** GS1 mod-10 check digit of a payload (reference implementation) */
const checkDigit = (payload: string): string => {
  let sum = 0;
  for (let i = payload.length - 1, w = 3; i >= 0; i--, w = 4 - w) {
    sum += Number(payload[i]) * w;
  }
  return String((10 - (sum % 10)) % 10);
};

/**
 * Reference UPC-E expansion (GS1 zero-suppression table), written
 * independently from the implementation: manufacturer + product codes.
 */
const referenceExpand = (system: string, data: string): string => {
  const [d1, d2, d3, d4, d5, d6] = data.split("");
  const last = Number(d6);
  let manufacturer: string;
  let product: string;
  if (last <= 2) {
    manufacturer = `${d1}${d2}${d6}00`;
    product = `00${d3}${d4}${d5}`;
  } else if (last === 3) {
    manufacturer = `${d1}${d2}${d3}00`;
    product = `000${d4}${d5}`;
  } else if (last === 4) {
    manufacturer = `${d1}${d2}${d3}${d4}0`;
    product = `0000${d5}`;
  } else {
    manufacturer = `${d1}${d2}${d3}${d4}${d5}`;
    product = `0000${d6}`;
  }
  const payload = `${system}${manufacturer}${product}`;
  return `${payload}${checkDigit(payload)}`;
};

/** UPC-A in the GTIN-8 range (same GTIN-14 as an EAN-8) */
const inGtin8Range = (upca: string): boolean => upca.startsWith("0000");

/** Seeded UPC-E samples, every last digit included */
const samples = (() => {
  let seed = 7;
  const random = () => (seed = (seed * 16_807) % 2_147_483_647) / 2_147_483_647;
  return Array.from({ length: 2000 }, (_, n) => {
    const system = String(n % 2);
    let data = "";
    for (let i = 0; i < 5; i++) {
      data += String(Math.floor(random() * 10));
    }
    data += String(n % 10);
    const upca = referenceExpand(system, data);
    return { upce: `${system}${data}${upca.at(-1)}`, upca };
  });
})();

describe("expandUpcE", () => {
  it.each([
    ["04252614", "042100005264"],
    ["01234565", "012345000065"],
    ["06543217", "065100004327"],
  ])("should expand %s to %s", (upce, upca) => {
    expect(expandUpcE(upce)).toBe(upca);
  });

  it("should expand like the reference GS1 table", () => {
    for (const { upce, upca } of samples) {
      // UPC-A starting with 0000 (GTIN-8 range) refused, restricted or not
      expect(expandUpcE(upce, { acceptRestricted: true })).toBe(
        inGtin8Range(upca) ? null : upca
      );
    }
    expect(samples.some(({ upca }) => inGtin8Range(upca))).toBe(true);
  });

  it("should agree with isUpcA on the expanded value", () => {
    for (const { upce, upca } of samples) {
      const expected = isUpcA(upca) && !inGtin8Range(upca);
      expect(isUpcE(upce)).toBe(expected);
      expect(expandUpcE(upce)).toBe(expected ? upca : null);
    }
  });

  it.each([
    ["04252615", "invalid check digit"],
    ["24252614", "number system 2"],
    ["94252614", "number system 9"],
    ["0425261", "7 digits"],
    ["042526144", "9 digits"],
    ["0425a614", "non digit"],
    ["", "empty"],
  ])("should return null for %s (%s)", (upce) => {
    expect(expandUpcE(upce)).toBeNull();
  });

  it("should trim by default", () => {
    expect(expandUpcE(" 04252614\n")).toBe("042100005264");
    expect(expandUpcE(" 04252614", { trim: false })).toBeNull();
  });

  it("should return null for non strings", () => {
    expect(expandUpcE(4_252_614 as unknown as string)).toBeNull();
  });

  it("should return a UpcA", () => {
    expectTypeOf(expandUpcE("04252614")).toEqualTypeOf<UpcA | null>();
  });
});

describe("compressUpcA", () => {
  it.each([
    ["042100005264", "04252614"],
    ["012345000065", "01234565"],
    ["065100004327", "06543217"],
    ["0042100005264", "04252614"],
    ["00042100005264", "04252614"],
    [" 042100005264\n", "04252614"],
  ])("should compress %j to %s", (gtin, upce) => {
    expect(compressUpcA(gtin)).toBe(upce);
  });

  it("should round-trip with expandUpcE", () => {
    for (const { upca } of samples.filter((v) => !inGtin8Range(v.upca))) {
      const upce = compressUpcA(upca, { acceptRestricted: true });
      // every expanded UPC-E can be compressed back (canonical form)
      expect(upce).not.toBeNull();
      expect(expandUpcE(upce ?? "", { acceptRestricted: true })).toBe(upca);
    }
  });

  it("should not compress the GTIN-8 range (EAN-8, no UPC-A form)", () => {
    const gtin8Range = samples.filter((v) => inGtin8Range(v.upca));
    expect(gtin8Range.length).toBeGreaterThan(0);
    for (const { upca } of gtin8Range) {
      expect(compressUpcA(upca, { acceptRestricted: true })).toBeNull();
    }
  });

  it("should give the canonical UPC-E of a non canonical one", () => {
    // d6 = 3 with d3 <= 2: same UPC-A as the d6 = 0-2 form
    const upca = referenceExpand("0", "122453");
    expect(upca).toBe("012200000452");
    expect(expandUpcE("01224532")).toBe(upca);
    expect(compressUpcA(upca)).toBe("01204522");
    expect(expandUpcE("01204522")).toBe(upca);
  });

  it.each([
    ["036000291452", "no suppressible zeros"],
    ["212345678992", "number system 2"],
    ["4006381333931", "EAN-13 (no UPC-A form)"],
    ["10012345678902", "GTIN-14 with indicator"],
    ["042100005265", "invalid check digit"],
    ["012345000045", "product 00004 (needs 5-9)"],
    ["10000007", "EAN-8 (GTIN-8 range, no UPC-A form)"],
    ["000010000007", "UPC-A form of the EAN-8 10000007"],
  ])("should return null for %s (%s)", (gtin) => {
    expect(compressUpcA(gtin)).toBeNull();
  });

  it("should return a UpcE", () => {
    expectTypeOf(compressUpcA("042100005264")).toEqualTypeOf<UpcE | null>();
  });
});

describe("isUpcE / assertUpcE", () => {
  it("should narrow to UpcE", () => {
    const v: unknown = "04252614";
    if (isUpcE(v)) {
      expectTypeOf(v).toEqualTypeOf<UpcE>();
    }
    expect(isUpcE(v)).toBe(true);
  });

  it("should never trim", () => {
    expect(isUpcE(" 04252614")).toBe(false);
  });

  it("should refuse the GTIN-8 range (UPC-A starting with 0000)", () => {
    // restricted: EAN-8 "00000123" (starting with 0)
    expect(referenceExpand("0", "000123")).toBe("000000000123");
    // not restricted: EAN-8 "10000007"
    expect(referenceExpand("0", "000104")).toBe("000010000007");
    for (const upce of ["00001233", "00001047"]) {
      expect(isUpcE(upce)).toBe(false);
      expect(isUpcE(upce, { acceptRestricted: true })).toBe(false);
      expect(expandUpcE(upce, { acceptRestricted: true })).toBeNull();
    }
  });

  it("should throw a TypeError", () => {
    expect(() => assertUpcE("04252615")).toThrow(
      new TypeError("Value is expected to be a UPC-E, got: string(length:8)")
    );
    expect(() => assertUpcE("04252614")).not.toThrow();
  });
});

describe("parseGtin with upce", () => {
  it("should read 8 digit strings as UPC-E", () => {
    expect(parseGtin("04252614", { upce: true })).toStrictEqual({
      success: true,
      value: "042100005264",
      type: "upca",
      gtin: "00042100005264",
      inputType: "upce",
      indicator: 0,
      category: "trade_item",
    });
    expect(parseGtin(" 01234565\n", { upce: true })).toMatchObject({
      success: true,
      value: "012345000065",
      inputType: "upce",
    });
  });

  it("should read them as EAN-8 by default", () => {
    // "01234565" as EAN-8: starts with 0, restricted circulation
    expect(parseGtin("01234565")).toStrictEqual({
      success: false,
      reason: "restricted",
    });
    expect(parseGtin("96385074")).toMatchObject({ inputType: "ean8" });
  });

  it.each([
    ["04252615", "invalid_check_digit"],
    ["24252614", "invalid_format"],
    ["0425a614", "invalid_format"],
    // GTIN-8 range: would be the EAN-8 "10000007", not a UPC-A
    ["00001047", "invalid_format"],
  ])("should refuse %s (%s)", (value, reason) => {
    expect(parseGtin(value, { upce: true })).toStrictEqual({
      success: false,
      reason,
    });
  });

  it("should not read numbers as UPC-E", () => {
    // 8 digit number: EAN-8, a UPC-E starts with 0 or 1 (lost as a number)
    expect(parseGtin(96_385_074, { upce: true })).toMatchObject({
      inputType: null,
      type: "ean8",
    });
  });

  it("should match types on the UPC-A", () => {
    expect(parseGtin("04252614", { upce: true, types: ["upca"] }).success).toBe(
      true
    );
    expect(
      parseGtin("04252614", { upce: true, types: ["ean8"] })
    ).toStrictEqual({
      success: false,
      reason: "invalid_barcode_type",
    });
  });

  it("should count a UPC-E as its UPC-A for minLength", () => {
    expect(parseGtin("04252614", { upce: true, minLength: 12 })).toMatchObject({
      success: true,
      value: "042100005264",
      inputType: "upce",
    });
    expect(parseGtin("04252614", { upce: true, minLength: 13 })).toStrictEqual({
      success: false,
      reason: "invalid_length",
    });
    // other lengths still checked as given (7 digits: not a UPC-E, less
    // than 8 significant digits so restricted)
    expect(parseGtin("0425261", { upce: true, minLength: 7 })).toStrictEqual({
      success: false,
      reason: "restricted",
    });
    expect(parseGtin("123456789", { upce: true, minLength: 12 })).toStrictEqual(
      { success: false, reason: "invalid_length" }
    );
    expect(parseGtin("abcdefghi", { upce: true, minLength: 12 })).toStrictEqual(
      { success: false, reason: "invalid_format" }
    );
  });

  it("should leave other lengths unchanged", () => {
    expect(parseGtin("4006381333931", { upce: true })).toMatchObject({
      value: "4006381333931",
      inputType: "ean13",
    });
  });
});

describe("detectBarcodeType", () => {
  it("should detect 8 digits as ean8 (use isUpcE when known)", () => {
    // valid as both: UPC-A "100001000068" or EAN-8 "10000168"
    expect(isUpcE("10000168")).toBe(true);
    expect(expandUpcE("10000168")).toBe("100001000068");
    expect(detectBarcodeType("10000168")).toBe("ean8");
    expect(parseGtin("10000168")).toMatchObject({ type: "ean8" });
    expect(parseGtin("10000168", { upce: true })).toMatchObject({
      type: "upca",
      value: "100001000068",
    });
    // only valid as UPC-E (EAN-8 starting with 0: restricted)
    expect(detectBarcodeType("04252614")).toBeNull();
  });
});
