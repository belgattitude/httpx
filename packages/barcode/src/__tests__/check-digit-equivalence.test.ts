import { describe, expect, it } from "vitest";

import { getBarcodeSeeds } from "../../bench/bench-seeds";
import { isGtin } from "../is-gtin";

const naiveIsGtin = (code: string, acceptRestricted = false): boolean => {
  if (!/^(?:\d{8}|\d{12,14})$/.test(code)) {
    return false;
  }
  let sum = 0;
  for (let i = code.length - 2, w = 3; i >= 0; i--, w = 4 - w) {
    sum += Number(code[i]) * w;
  }
  // restricted circulation numbers, on the GTIN-14 form
  const gtin14 = code.padStart(14, "0");
  const isRestricted = gtin14.startsWith("000000")
    ? /^000000[02]/.test(gtin14)
    : /^.(?:2|02|04)/.test(gtin14);
  if (isRestricted && !acceptRestricted) {
    return false;
  }
  return (10 - (sum % 10)) % 10 === Number(code.at(-1));
};

describe("isGtin (optimized) equivalence", () => {
  it("should match a naive implementation on generated codes", () => {
    const codes = getBarcodeSeeds(5000);
    expect(codes.filter((c) => isGtin(c) !== naiveIsGtin(c))).toStrictEqual([]);
    // sanity: the seeds contain both valid and invalid codes
    const valid = codes.filter((c) => isGtin(c)).length;
    expect(valid).toBeGreaterThan(3000);
    expect(valid).toBeLessThan(5000);
  });

  it("should match a naive implementation with acceptRestricted", () => {
    const codes = getBarcodeSeeds(5000);
    expect(
      codes.filter(
        (c) => isGtin(c, { acceptRestricted: true }) !== naiveIsGtin(c, true)
      )
    ).toStrictEqual([]);
  });
});
