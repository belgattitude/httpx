import type { MsgOrErrorFactory } from "./assert-utils";
import { throwAssertError } from "./assert-utils";
import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import { toGtinDigits } from "./gtin-digits";
import type { Gtin14, GtinTrimOptions } from "./types";

export type NormalizeGtinOptions = GtinTrimOptions & {
  /**
   * Minimum number of digits of the input, as given (leading zeros included
   * for strings). Integer between 1 and 14.
   *
   * A value with less than 8 significant digits is an EAN-8 starting with
   * 0 (an in-store code): lowering it accepts the ones stored as numbers
   * (leading zeros lost), but also 1 in 10 of any small number (the check
   * digit is the only validation left). Mostly useful to raise the minimum,
   * ie: `12` to refuse EAN-8 inputs.
   * @default 8
   */
  minLength?: number;
};

/**
 * Normalize a GTIN (string, number or bigint) to its canonical 14 digits
 * form (GTIN-14, left-padded with zeros), as recommended by GS1 for storage
 * and comparison. Returns `null` if the value isn't a valid GTIN.
 *
 * Useful when leading zeros were lost (ie: number from JSON, spreadsheet or
 * numeric database column). The check digit is not affected by left-padding.
 *
 * Restricted circulation numbers (in-store codes) are valid GTINs: use
 * `isInStoreGtin` (or the `category` of `parseGtin`) to tell them
 * apart.
 *
 * Accepted values:
 *  - strings of digits only (no separators), leading and trailing whitespace
 *    is trimmed unless `trim: false`.
 *  - non-negative safe integers.
 *  - non-negative bigints.
 *
 * @example
 * ```typescript
 * normalizeGtin(36000291452); // 👈 "00036000291452"
 * normalizeGtin("036000291452"); // 👈 "00036000291452" (UPC-A)
 * normalizeGtin("0036000291452"); // 👈 "00036000291452" (same product as EAN-13)
 * normalizeGtin(4006381333931n); // 👈 "04006381333931"
 * normalizeGtin(" 4006381333931\n"); // 👈 "04006381333931" (trimmed)
 * normalizeGtin(" 4006381333931", { trim: false }); // 👈 null
 * normalizeGtin(4006380000000); // 👈 null (invalid check digit)
 * normalizeGtin(96385074, { minLength: 12 }); // 👈 null (EAN-8 refused)
 * normalizeGtin(21234569); // 👈 "00000021234569" (in-store EAN-8)
 * ```
 *
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const normalizeGtin = (
  value: unknown,
  options?: NormalizeGtinOptions
): Gtin14 | null => {
  const digits = toGtinDigits(value, options);
  // validated before padding (no allocation for invalid values), the check
  // digit and restricted ranges don't depend on the leading zeros
  return digits !== null && hasValidGtinCheckDigit(digits)
    ? (digits.padStart(14, "0") as Gtin14)
    : null;
};

/**
 * Normalize a GTIN like `normalizeGtin` and return it, or throw when the value
 * isn't a valid GTIN.
 *
 * @example
 * ```typescript
 * const gtin = assertNormalizedGtin(36000291452); // 👈 "00036000291452" (Gtin14)
 * assertNormalizedGtin(4006380000000); // 👈 throws TypeError('Value is expected to be a GTIN, got: number')
 * assertNormalizedGtin(v, "Invalid barcode"); // 👈 throws TypeError('Invalid barcode')
 * assertNormalizedGtin(v, () => new HttpBadRequest()); // 👈 throws HttpBadRequest
 * assertNormalizedGtin(v, undefined, { minLength: 12 });
 * ```
 *
 * @throws TypeError (or the error returned by the factory) when invalid
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const assertNormalizedGtin = (
  value: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: NormalizeGtinOptions
): Gtin14 =>
  normalizeGtin(value, options) ??
  throwAssertError(value, "a GTIN", msgOrErrorFactory);
