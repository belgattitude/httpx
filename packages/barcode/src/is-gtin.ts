import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import type { Gtin } from "./types";

/**
 * Check if a value is a valid GTIN (GTIN-8, GTIN-12/UPC-A, GTIN-13/EAN-13 or
 * GTIN-14) by verifying its length and its mod-10 check digit. Restricted
 * circulation numbers (in-store codes) are valid GTINs: use
 * `isInStoreGtin` (or the `category` of `parseGtin`) to tell them
 * apart.
 *
 * @example
 * ```typescript
 * isGtin("4006381333931"); // 👈 true
 * isGtin("4006381333932"); // 👈 false (invalid check digit)
 * isGtin("2123456789010"); // 👈 true (in-store code)
 * ```
 */
export const isGtin = (v: unknown): v is Gtin => {
  if (typeof v !== "string") {
    return false;
  }
  const len = v.length;
  return (
    (len === 13 || len === 12 || len === 8 || len === 14) &&
    hasValidGtinCheckDigit(v)
  );
};
