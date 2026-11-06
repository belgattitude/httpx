/* oxlint-disable unicorn/prefer-code-point, no-bitwise -- hot path, same as gtin-check-digit.ts: charCodeAt and a single unsigned comparison to check a digit */
import type { NormalizeGtinOptions } from "./normalize-gtin";

/**
 * `String.prototype.trim` with a fast path: when both ends are digits (the
 * common case) the string is returned as is, without calling trim (measured
 * ~25% of detectBarcodeType on node). An empty string is returned as is.
 *
 * @internal
 */
export const trimGtinString = (value: string): string =>
  // `>>> 0 > 9`: not a digit (negative or NaN after the subtraction included)
  (value.charCodeAt(0) - 48) >>> 0 > 9 ||
  (value.charCodeAt(value.length - 1) - 48) >>> 0 > 9
    ? value.trim()
    : value;

/**
 * Convert a string (trimmed unless `trim: false`), number or bigint to its
 * digits (between minLength and 14 chars, not padded). Digits are NOT validated (see isValidGtinDigits).
 *
 * @internal
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const toGtinDigits = (
  value: unknown,
  options?: NormalizeGtinOptions
): string | null => {
  const minLength = options?.minLength ?? 8;
  if (!Number.isInteger(minLength) || minLength < 1 || minLength > 14) {
    throw new RangeError(
      `minLength must be an integer between 1 and 14, got: ${minLength}`
    );
  }
  let digits: string;
  if (typeof value === "string") {
    digits = options?.trim === false ? value : trimGtinString(value);
  } else if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value < 0) {
      return null;
    }
    digits = String(value);
  } else if (typeof value === "bigint") {
    if (value < 0n) {
      return null;
    }
    digits = value.toString();
  } else {
    return null;
  }
  return digits.length < minLength || digits.length > 14 ? null : digits;
};
