import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import { getMinLength, readGtinDigits } from "./gtin-digits";
import { isRestrictedGtinDigits } from "./gtin-validate";
import type { NormalizeGtinOptions } from "./normalize-gtin";

export type IsInStoreGtinOptions = Omit<NormalizeGtinOptions, "trim"> & {
  /**
   * Remove leading and trailing whitespace of strings. Off by default: like
   * the type guards, it returns a boolean, not the trimmed value (a string
   * with whitespace would be reported as a restricted GTIN and kept as is).
   * @default false
   */
  trim?: boolean;
};

/**
 * Check if a GTIN is an in-store code, a GS1 Restricted Circulation Number
 * (RCN, the `in_store` category of `parseGtin`): a code only
 * meaningful within a company or a geographic region (ie: in-store labels,
 * variable measure items with an embedded weight or price), not a globally
 * unique trade item identifier.
 *
 * The other functions accept RCNs as valid GTINs (`parseGtin` reports them
 * with the `in_store` category), this one tells them apart.
 *
 * Ranges (GS1 Prefix, on the GTIN-13 / GTIN-14 form):
 *  - EAN-8 starting with 0 or 2 (RCN-8).
 *  - EAN-13 starting with 02 or 20-29 (geographic region, defined by the
 *    GS1 Member Organisation), 04 (company internal).
 *  - UPC-A starting with 2 or 4 (the same ranges: UPC-A "2..." is "02..." as
 *    an EAN-13).
 *  - GTIN-14 containing one of the above (digits after the indicator).
 *
 * Accepts the same values and options as `normalizeGtin` (string, number or
 * bigint, leading zeros can be lost), except
 * `trim` that is off by default (opt-in with `trim: true`), and returns `false` for anything that isn't
 * a GTIN with a valid check digit.
 *
 * @example
 * ```typescript
 * isInStoreGtin("2123456789010"); // 👈 true (EAN-13 starting with 2)
 * isInStoreGtin("212345678992"); // 👈 true (UPC-A starting with 2)
 * isInStoreGtin("21234569"); // 👈 true (EAN-8 starting with 2)
 * isInStoreGtin(212345678992); // 👈 true (number)
 * isInStoreGtin("4006381333931"); // 👈 false
 * isInStoreGtin("2123456789011"); // 👈 false (invalid check digit)
 * isInStoreGtin(" 2123456789010"); // 👈 false (not trimmed)
 * isInStoreGtin(" 2123456789010", { trim: true }); // 👈 true
 * ```
 *
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const isInStoreGtin = (
  value: unknown,
  options?: IsInStoreGtinOptions
): boolean => {
  const digits = readGtinDigits(
    value,
    getMinLength(options),
    options?.trim === true
  );
  return (
    typeof digits === "string" &&
    hasValidGtinCheckDigit(digits) &&
    isRestrictedGtinDigits(digits)
  );
};
