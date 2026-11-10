import { describe, expect, expectTypeOf, it } from "vitest";

import { assertUpcE } from "../barcode-asserts";
import { isEan8, isUpcA, isUpcE } from "../barcode-guards";
import { createGtinParser } from "../create-gtin-parser";
import {
  type BarcodeFormat,
  type BarcodeType,
  detectBarcodeType,
} from "../detect-barcode-type";
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
      // UPC-A starting with 0000 (GTIN-8 range) refused
      expect(expandUpcE(upce)).toBe(inGtin8Range(upca) ? null : upca);
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
      const upce = compressUpcA(upca);
      // every expanded UPC-E can be compressed back (canonical form)
      expect(upce).not.toBeNull();
      expect(expandUpcE(upce ?? "")).toBe(upca);
    }
  });

  it("should not compress the GTIN-8 range (EAN-8, no UPC-A form)", () => {
    const gtin8Range = samples.filter((v) => inGtin8Range(v.upca));
    expect(gtin8Range.length).toBeGreaterThan(0);
    for (const { upca } of gtin8Range) {
      expect(compressUpcA(upca)).toBeNull();
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
      expect(expandUpcE(upce)).toBeNull();
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
      format: "upce",
      indicator: 0,
      category: "trade_item",
    });
    expect(parseGtin(" 01234565\n", { upce: true })).toMatchObject({
      success: true,
      value: "012345000065",
      format: "upce",
    });
  });

  it("should read them as EAN-8 by default", () => {
    // "01234565" as EAN-8: starts with 0, restricted circulation (in-store)
    expect(parseGtin("01234565")).toMatchObject({
      success: true,
      value: "01234565",
      format: "ean8",
      category: "in_store",
    });
    expect(parseGtin("96385074")).toMatchObject({ format: "ean8" });
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
      format: null,
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
      format: "upce",
    });
    expect(parseGtin("04252614", { upce: true, minLength: 13 })).toStrictEqual({
      success: false,
      reason: "invalid_length",
    });
    // other lengths still checked as given (7 digits: not a UPC-E, less
    // than 8 significant digits so an in-store EAN-8)
    expect(parseGtin("0425261", { upce: true, minLength: 7 })).toMatchObject({
      success: true,
      value: "00425261",
      format: null,
      category: "in_store",
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
      format: "ean13",
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
    // only valid as UPC-E (invalid EAN-8 check digit)
    expect(detectBarcodeType("04252614")).toBeNull();
  });
});

describe("upce: prefer-upce", () => {
  it.each([
    ["04252614", "upce", "042100005264", "UPC-E only (restricted EAN-8)"],
    ["01234565", "upce", "012345000065", "both, EAN-8 restricted"],
    ["10000168", "ean8", "10000168", "both, number system 1"],
    ["96385074", "ean8", "96385074", "EAN-8 only"],
  ] as const)("should read %s as %s (%s)", (code, format, value, _label) => {
    expect(parseGtin(code, { upce: "prefer-upce" })).toMatchObject({
      success: true,
      value,
      format,
    });
    expect(detectBarcodeType(code, { upce: "prefer-upce" })).toBe(format);
  });

  it.each([
    ["04252615", "invalid_check_digit", "invalid as both"],
    ["00001047", "invalid_check_digit", "UPC-E in the GTIN-8 range"],
    ["10000016", "invalid_check_digit", "UPC-E only, number system 1"],
  ])("should read %s as EAN-8 and refuse it (%s, %s)", (code, reason) => {
    expect(parseGtin(code, { upce: "prefer-upce" })).toStrictEqual({
      success: false,
      reason,
    });
    expect(parseGtin(code, { upce: "prefer-upce" })).toStrictEqual(
      parseGtin(code)
    );
    expect(detectBarcodeType(code, { upce: "prefer-upce" })).toBeNull();
  });

  it.each([
    ["01000016", "in-store EAN-8, invalid UPC-E"],
    ["24252614", "in-store EAN-8, number system 2"],
  ])("should read %s as an in-store EAN-8 (%s)", (code) => {
    expect(parseGtin(code, { upce: "prefer-upce" })).toMatchObject({
      success: true,
      value: code,
      format: "ean8",
      category: "in_store",
    });
    expect(parseGtin(code, { upce: "prefer-upce" })).toStrictEqual(
      parseGtin(code)
    );
    expect(detectBarcodeType(code, { upce: "prefer-upce" })).toBe("ean8");
  });

  it("should prefer a valid UPC-E over an in-store EAN-8", () => {
    expect(parseGtin("01234565", { upce: "prefer-upce" })).toMatchObject({
      value: "012345000065",
      format: "upce",
      category: "trade_item",
    });
    // invalid UPC-E: stays an EAN-8, in-store
    expect(parseGtin("01000016", { upce: "prefer-upce" })).toMatchObject({
      value: "01000016",
      format: "ean8",
      category: "in_store",
    });
    expect(detectBarcodeType("01000016", { upce: "prefer-upce" })).toBe("ean8");
  });

  it("should agree with isEan8 and isUpcE", () => {
    let seed = 11;
    const random = () =>
      (seed = (seed * 16_807) % 2_147_483_647) / 2_147_483_647;
    const codes = [
      ...samples.map((v) => v.upce),
      ...Array.from({ length: 4000 }, () =>
        String(Math.floor(random() * 2e7)).padStart(8, "0")
      ),
    ];
    /**
     * Reference: UPC-E when valid with the number system 0, EAN-8 otherwise
     * (value of the result), in-store EAN-8 (restricted circulation)
     * included.
     */
    const reference = (
      code: string
    ): ["ean8" | "upce", string | null] | [null, null] => {
      if (code.startsWith("0") && isUpcE(code)) {
        return ["upce", expandUpcE(code)];
      }
      return isEan8(code) ? ["ean8", code] : [null, null];
    };
    const counts = { upce: 0, ean8: 0, null: 0 };
    for (const code of codes) {
      const [format, value] = reference(code);
      counts[format ?? "null"]++;
      expect(detectBarcodeType(code, { upce: "prefer-upce" })).toBe(format);
      const parsed = parseGtin(code, { upce: "prefer-upce" });
      expect(
        parsed.success ? [parsed.format, parsed.value] : null
      ).toStrictEqual(format === null ? null : [format, value]);
    }
    // every outcome covered
    expect(Object.values(counts).every((n) => n > 0)).toBe(true);
  });

  it("should only detect the number system 0", () => {
    const valid = samples.filter((v) => isUpcE(v.upce));
    const system1 = valid.filter((v) => v.upce.startsWith("1"));
    expect(system1.length).toBeGreaterThan(100);
    expect(valid.length - system1.length).toBeGreaterThan(100);
    for (const { upce, upca } of valid) {
      const expected = upce.startsWith("0") ? "upce" : null;
      // number system 1: an EAN-8 (when valid as one), read with upce: true
      expect(detectBarcodeType(upce, { upce: "prefer-upce" })).toBe(
        expected ?? (isEan8(upce) ? "ean8" : null)
      );
      expect(detectBarcodeType(upce, { upce: true })).toBe("upce");
      expect(parseGtin(upce, { upce: true })).toMatchObject({ value: upca });
    }
    // ending with 5 to 9: zeros inserted in pairs, same check digit as the
    // EAN-8 reading (why the number system 1 can't be detected)
    const ending5to9 = system1.filter(({ upce }) => upce.charAt(6) >= "5");
    expect(ending5to9.length).toBeGreaterThan(100);
    expect(ending5to9.every(({ upce }) => isEan8(upce))).toBe(true);
  });

  it("should not read numbers as UPC-E", () => {
    expect(parseGtin(10_000_016, { upce: "prefer-upce" })).toStrictEqual({
      success: false,
      reason: "invalid_check_digit",
    });
  });

  it("should count a UPC-E as its UPC-A for minLength", () => {
    expect(
      parseGtin("04252614", { upce: "prefer-upce", minLength: 12 })
    ).toMatchObject({ success: true, format: "upce" });
    expect(
      parseGtin("96385074", { upce: "prefer-upce", minLength: 12 })
    ).toStrictEqual({ success: false, reason: "invalid_length" });
  });

  it("should match types on the UPC-A", () => {
    expect(
      parseGtin("04252614", { upce: "prefer-upce", types: ["ean8"] })
    ).toStrictEqual({ success: false, reason: "invalid_barcode_type" });
  });

  it("should be accepted by createGtinParser", () => {
    const parser = createGtinParser({ upce: "prefer-upce", types: ["upca"] });
    expect(parser.parse("04252614")).toMatchObject({
      value: "042100005264",
      format: "upce",
    });
  });
});

describe("upce: prefer-ean8", () => {
  const options = { upce: "prefer-ean8" } as const;

  it("should read a UPC-E that can't be an EAN-8", () => {
    // EAN-8 check digit invalid
    expect(isEan8("04252614")).toBe(false);
    expect(parseGtin("04252614", options)).toMatchObject({
      success: true,
      value: "042100005264",
      format: "upce",
    });
    expect(detectBarcodeType("04252614", options)).toBe("upce");
  });

  it("should keep a code that is also a restricted EAN-8", () => {
    // valid as both: UPC-A "012345000065" or the in-store EAN-8 "01234565"
    expect(isUpcE("01234565")).toBe(true);
    expect(isEan8("01234565")).toBe(true);
    expect(parseGtin("01234565", options)).toMatchObject({
      success: true,
      value: "01234565",
      format: "ean8",
      category: "in_store",
    });
    expect(detectBarcodeType("01234565", options)).toBe("ean8");
    expect(detectBarcodeType("01234565", { upce: "prefer-upce" })).toBe("upce");
    // prefer-upce expands it
    expect(parseGtin("01234565", { upce: "prefer-upce" })).toMatchObject({
      value: "012345000065",
      format: "upce",
    });
  });

  it.each([
    ["96385074", "ean8"],
    ["10000168", "ean8"],
    ["10000016", null],
    ["04252615", null],
    ["24252614", "ean8"],
  ] as const)("should read %s like without upce (%s)", (code, format) => {
    expect(parseGtin(code, options)).toStrictEqual(parseGtin(code));
    expect(detectBarcodeType(code, options)).toBe(format);
    expect(detectBarcodeType(code)).toBe(format);
  });

  it("should never expand a code with a valid EAN-8 check digit", () => {
    const counts = { upce: 0, kept: 0 };
    // number system 0 (the number system 1 is never detected)
    const system0 = samples.filter(
      (v) => v.upce.startsWith("0") && isUpcE(v.upce)
    );
    for (const { upce, upca } of system0) {
      // also an in-store EAN-8 with a valid check digit: kept
      const expected = !isEan8(upce);
      counts[expected ? "upce" : "kept"]++;
      expect(detectBarcodeType(upce, options) === "upce").toBe(expected);
      const parsed = parseGtin(upce, options);
      expect(parsed).toMatchObject(
        expected
          ? { value: upca, format: "upce" }
          : { value: upce, format: "ean8" }
      );
      // subset of prefer-upce
      expect(
        !expected || detectBarcodeType(upce, { upce: "prefer-upce" }) === "upce"
      ).toBe(true);
    }
    expect(counts.upce).toBeGreaterThan(100);
    expect(counts.kept).toBeGreaterThan(100);
  });

  it("should be the mode of formats listing upce", () => {
    for (const code of ["04252614", "01234565", "96385074", "10000168"]) {
      expect(parseGtin(code, { formats: ["upce", "ean8"] })).toStrictEqual(
        parseGtin(code, { ...options, formats: ["upce", "ean8"] })
      );
    }
    // kept as an in-store EAN-8: not a listed format
    expect(parseGtin("01234565", { formats: ["upce"] })).toStrictEqual({
      success: false,
      reason: "format_not_accepted",
    });
    expect(parseGtin("01234565", { formats: ["upce", "ean8"] })).toMatchObject({
      format: "ean8",
      category: "in_store",
    });
  });
});

describe("detectBarcodeType with upce", () => {
  it("should detect valid UPC-E as upce with upce: true", () => {
    expect(detectBarcodeType("04252614", { upce: true })).toBe("upce");
    expect(detectBarcodeType("10000168", { upce: true })).toBe("upce");
    expect(detectBarcodeType("96385074", { upce: true })).toBeNull();
    expect(detectBarcodeType("04252615", { upce: true })).toBeNull();
    expect(detectBarcodeType("00001047", { upce: true })).toBeNull();
    expect(detectBarcodeType(" 4252614", { upce: true })).toBeNull();
  });

  it("should leave other lengths unchanged", () => {
    for (const upce of [true, "prefer-upce", "prefer-ean8"] as const) {
      expect(detectBarcodeType("4006381333931", { upce })).toBe("ean13");
      expect(detectBarcodeType("042100005264", { upce })).toBe("upca");
    }
  });

  it("should only type upce with the upce option", () => {
    expectTypeOf(
      detectBarcodeType("04252614")
    ).toEqualTypeOf<BarcodeType | null>();
    expectTypeOf(
      detectBarcodeType("04252614", { upce: false })
    ).toEqualTypeOf<BarcodeType | null>();
    expectTypeOf(
      detectBarcodeType("04252614", { upce: "prefer-upce" })
    ).toEqualTypeOf<BarcodeFormat | null>();
    expectTypeOf(
      detectBarcodeType("04252614", { upce: true })
    ).toEqualTypeOf<BarcodeFormat | null>();
  });
});
