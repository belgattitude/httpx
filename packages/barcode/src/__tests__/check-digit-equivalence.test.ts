import { describe, expect, it } from "vitest";

import { getBarcodeSeeds } from "../../bench/bench-seeds";
import { isGtin } from "../is-gtin";

const naiveIsGtin = (code: string): boolean => {
  if (!/^(?:\d{8}|\d{12,14})$/.test(code)) {
    return false;
  }
  let sum = 0;
  for (let i = code.length - 2, w = 3; i >= 0; i--, w = 4 - w) {
    sum += Number(code[i]) * w;
  }
  // EAN-8 starting with 0 or 2 (restricted circulation), even when padded
  const gtin14 = code.padStart(14, "0");
  if (/^000000[02]/.test(gtin14)) {
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
});
