import { isValidGtinDigits } from "./gtin-validate";
import type { Ean8, Ean13, Gtin14, UpcA } from "./types";

/**
 * Check if a value is a valid EAN-13 (13 digits, valid check digit).
 *
 * @example
 * ```typescript
 * isEan13("4006381333931"); // 👈 true
 * isEan13("4006381333932"); // 👈 false (invalid check digit)
 * ```
 */
export const isEan13 = (v: unknown): v is Ean13 =>
  typeof v === "string" && v.length === 13 && isValidGtinDigits(v);

/**
 * Check if a value is a valid EAN-8 (8 digits, valid check digit).
 *
 * @example
 * ```typescript
 * isEan8("96385074"); // 👈 true
 * ```
 */
export const isEan8 = (v: unknown): v is Ean8 =>
  typeof v === "string" && v.length === 8 && isValidGtinDigits(v);

/**
 * Check if a value is a valid UPC-A (12 digits, valid check digit).
 *
 * @example
 * ```typescript
 * isUpcA("036000291452"); // 👈 true
 * ```
 */
export const isUpcA = (v: unknown): v is UpcA =>
  typeof v === "string" && v.length === 12 && isValidGtinDigits(v);

/**
 * Check if a value is a valid GTIN-14 (14 digits, valid check digit).
 *
 * @example
 * ```typescript
 * isGtin14("10012345678902"); // 👈 true
 * ```
 */
export const isGtin14 = (v: unknown): v is Gtin14 =>
  typeof v === "string" && v.length === 14 && isValidGtinDigits(v);
