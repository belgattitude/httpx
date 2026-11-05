import { isValidGtinDigits } from "./gtin-validate";
import type { Gtin, GtinValidationOptions } from "./types";

/**
 * Check if a value is a valid GTIN (GTIN-8, GTIN-12/UPC-A, GTIN-13/EAN-13 or
 * GTIN-14) by verifying its length and its mod-10 check digit. Restricted
 * circulation numbers are refused unless `acceptRestricted` is set.
 *
 * @example
 * ```typescript
 * isGtin("4006381333931"); // 👈 true
 * isGtin("4006381333932"); // 👈 false (invalid check digit)
 * isGtin("2123456789010"); // 👈 false (restricted circulation)
 * isGtin("2123456789010", { acceptRestricted: true }); // 👈 true
 * ```
 */
export const isGtin = (
  v: unknown,
  options?: GtinValidationOptions
): v is Gtin => {
  if (typeof v !== "string") {
    return false;
  }
  const len = v.length;
  return (
    (len === 13 || len === 12 || len === 8 || len === 14) &&
    isValidGtinDigits(v, options)
  );
};
