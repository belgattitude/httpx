import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import { padToGtin14 } from "./gtin-pad";
import type { NormalizeGtinOptions } from "./normalize-gtin";

/**
 * Check if a GTIN is a GS1 Restricted Circulation Number (RCN): a code only
 * meaningful within a company or a geographic region (ie: in-store labels,
 * variable measure items with an embedded weight or price), not a globally
 * unique trade item identifier.
 *
 * Opt-in check: except restricted EAN-8 (always refused), the other functions
 * accept RCNs as valid GTINs.
 *
 * Ranges (GS1 Prefix, on the GTIN-13 / GTIN-14 form):
 *  - EAN-8 starting with 0 or 2 (RCN-8).
 *  - EAN-13 starting with 02 or 20-29 (geographic region, defined by the
 *    GS1 Member Organisation), 04 (company internal).
 *  - UPC-A starting with 2 or 4 (the same ranges: UPC-A "2..." is "02..." as
 *    an EAN-13).
 *  - GTIN-14 containing one of the above (digits after the indicator).
 *
 * Accepts the same values as `normalizeGtin` (string, number or bigint,
 * leading zeros can be lost) and returns `false` for anything that isn't a
 * GTIN with a valid check digit.
 *
 * @example
 * ```typescript
 * isRestrictedCirculation("2123456789010"); // 👈 true (EAN-13 starting with 2)
 * isRestrictedCirculation("212345678992"); // 👈 true (UPC-A starting with 2)
 * isRestrictedCirculation("21234569"); // 👈 true (EAN-8 starting with 2)
 * isRestrictedCirculation(212345678992); // 👈 true (number)
 * isRestrictedCirculation("4006381333931"); // 👈 false
 * isRestrictedCirculation("2123456789011"); // 👈 false (invalid check digit)
 * ```
 *
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const isRestrictedCirculation = (
  value: unknown,
  options?: NormalizeGtinOptions
): boolean => {
  const gtin14 = padToGtin14(value, options);
  if (gtin14 === null || !hasValidGtinCheckDigit(gtin14)) {
    return false;
  }
  // GTIN-8 (six leading zeros once padded): GS1-8 Prefix 0 or 2
  if (gtin14.startsWith("000000")) {
    return gtin14[6] === "0" || gtin14[6] === "2";
  }
  // GS1 Prefix of the GTIN-13 (after the GTIN-14 indicator digit)
  const [, p1, p2] = gtin14;
  return p1 === "2" || (p1 === "0" && (p2 === "2" || p2 === "4"));
};
