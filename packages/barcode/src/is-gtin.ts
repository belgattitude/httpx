import { isValidGtinDigits } from "./gtin-validate";
import type { Gtin } from "./types";

/**
 * Check if a value is a valid GTIN (GTIN-8, GTIN-12/UPC-A, GTIN-13/EAN-13 or
 * GTIN-14) by verifying its length and its mod-10 check digit.
 *
 * @example
 * ```typescript
 * isGtin("4006381333931"); // 👈 true
 * isGtin("4006381333932"); // 👈 false (invalid check digit)
 * ```
 */
export const isGtin = (v: unknown): v is Gtin => {
  if (typeof v !== "string") {
    return false;
  }
  const len = v.length;
  return (
    (len === 13 || len === 12 || len === 8 || len === 14) &&
    isValidGtinDigits(v)
  );
};
