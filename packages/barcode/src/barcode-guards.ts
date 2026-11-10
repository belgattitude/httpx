import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import type { Ean8, Ean13, Gtin14, UpcA, UpcE } from "./types";
import { isValidUpcEDigits } from "./upce-digits";

/**
 * Check if a value is a valid EAN-13 (13 digits, valid check digit).
 * Restricted circulation numbers (in-store codes) are valid EAN-13: use
 * `isInStoreGtin` (or the `category` of `parseGtin`) to tell them
 * apart.
 *
 * @example
 * ```typescript
 * isEan13("4006381333931"); // 👈 true
 * isEan13("4006381333932"); // 👈 false (invalid check digit)
 * isEan13("2123456789010"); // 👈 true (in-store code)
 * ```
 */
export const isEan13 = (v: unknown): v is Ean13 =>
  typeof v === "string" && v.length === 13 && hasValidGtinCheckDigit(v);

/**
 * Check if a value is a valid EAN-8 (8 digits, valid check digit). Restricted
 * circulation numbers (in-store codes, starting with 0 or 2) are valid EAN-8,
 * see `isInStoreGtin`.
 *
 * @example
 * ```typescript
 * isEan8("96385074"); // 👈 true
 * isEan8("21234569"); // 👈 true (in-store code)
 * ```
 */
export const isEan8 = (v: unknown): v is Ean8 =>
  typeof v === "string" && v.length === 8 && hasValidGtinCheckDigit(v);

/**
 * Check if a value is a valid UPC-A (12 digits, valid check digit). Restricted
 * circulation numbers (in-store codes, starting with 2 or 4) are valid UPC-A,
 * see `isInStoreGtin`.
 *
 * @example
 * ```typescript
 * isUpcA("036000291452"); // 👈 true
 * ```
 */
export const isUpcA = (v: unknown): v is UpcA =>
  typeof v === "string" && v.length === 12 && hasValidGtinCheckDigit(v);

/**
 * Check if a value is a valid GTIN-14 (14 digits, valid check digit).
 * Restricted circulation numbers (in-store codes) are valid GTIN-14, see
 * `isInStoreGtin`.
 *
 * @example
 * ```typescript
 * isGtin14("10012345678902"); // 👈 true
 * ```
 */
export const isGtin14 = (v: unknown): v is Gtin14 =>
  typeof v === "string" && v.length === 14 && hasValidGtinCheckDigit(v);

/**
 * Check if a value is a valid UPC-E (8 digits, zero-suppressed UPC-A): number
 * system 0 or 1 and valid check digit, computed on the expanded UPC-A (see
 * `expandUpcE`). UPC-E expanding to the GTIN-8 range (UPC-A starting with
 * `0000`, the same GTIN as an EAN-8) are refused.
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
export const isUpcE = (v: unknown): v is UpcE =>
  typeof v === "string" && isValidUpcEDigits(v);
