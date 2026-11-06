import { isValidGtinDigits } from "./gtin-validate";
import type {
  Ean8,
  Ean13,
  Gtin14,
  GtinValidationOptions,
  UpcA,
  UpcE,
} from "./types";
import { expandUpcEDigits } from "./upce-digits";

/**
 * Check if a value is a valid EAN-13 (13 digits, valid check digit). Restricted
 * circulation numbers are refused unless `acceptRestricted` is set.
 *
 * @example
 * ```typescript
 * isEan13("4006381333931"); // 👈 true
 * isEan13("4006381333932"); // 👈 false (invalid check digit)
 * isEan13("2123456789010"); // 👈 false (restricted circulation)
 * isEan13("2123456789010", { acceptRestricted: true }); // 👈 true
 * ```
 */
export const isEan13 = (
  v: unknown,
  options?: GtinValidationOptions
): v is Ean13 =>
  typeof v === "string" && v.length === 13 && isValidGtinDigits(v, options);

/**
 * Check if a value is a valid EAN-8 (8 digits, valid check digit). Restricted
 * circulation numbers (starting with 0 or 2) are refused unless
 * `acceptRestricted` is set.
 *
 * @example
 * ```typescript
 * isEan8("96385074"); // 👈 true
 * isEan8("21234569"); // 👈 false (restricted circulation)
 * ```
 */
export const isEan8 = (
  v: unknown,
  options?: GtinValidationOptions
): v is Ean8 =>
  typeof v === "string" && v.length === 8 && isValidGtinDigits(v, options);

/**
 * Check if a value is a valid UPC-A (12 digits, valid check digit). Restricted
 * circulation numbers (starting with 2 or 4) are refused unless
 * `acceptRestricted` is set.
 *
 * @example
 * ```typescript
 * isUpcA("036000291452"); // 👈 true
 * ```
 */
export const isUpcA = (
  v: unknown,
  options?: GtinValidationOptions
): v is UpcA =>
  typeof v === "string" && v.length === 12 && isValidGtinDigits(v, options);

/**
 * Check if a value is a valid GTIN-14 (14 digits, valid check digit).
 * Restricted circulation numbers are refused unless `acceptRestricted` is set.
 *
 * @example
 * ```typescript
 * isGtin14("10012345678902"); // 👈 true
 * ```
 */
export const isGtin14 = (
  v: unknown,
  options?: GtinValidationOptions
): v is Gtin14 =>
  typeof v === "string" && v.length === 14 && isValidGtinDigits(v, options);

/**
 * Check if a value is a valid UPC-E (8 digits, zero-suppressed UPC-A): number
 * system 0 or 1 and valid check digit, both computed on the expanded UPC-A
 * (see `expandUpcE`). Restricted circulation numbers (of the UPC-A) are
 * refused unless `acceptRestricted` is set.
 *
 * An 8 digit value can be both a valid UPC-E and a valid EAN-8: only the
 * source (ie: the scanner symbology) tells which one it is.
 *
 * @example
 * ```typescript
 * isUpcE("04252614"); // 👈 true (UPC-A "042100005264")
 * isUpcE("04252615"); // 👈 false (invalid check digit)
 * isUpcE("24252614"); // 👈 false (number system must be 0 or 1)
 * ```
 */
export const isUpcE = (
  v: unknown,
  options?: GtinValidationOptions
): v is UpcE => {
  if (typeof v !== "string") {
    return false;
  }
  const upca = expandUpcEDigits(v);
  return upca !== null && isValidGtinDigits(upca, options);
};
