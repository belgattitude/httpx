/* oxlint-disable unicorn/prefer-code-point, no-bitwise -- hot path, same as gtin-check-digit.ts: charCodeAt and a single unsigned comparison to check a digit */
import type { NormalizeGtinOptions } from "./normalize-gtin";

/**
 * `String.prototype.trim` with a fast path: when both ends are digits (the
 * common case) the string is returned as is, without calling trim (measured
 * ~25% of detectBarcodeType on node).
 *
 * @internal
 */
export const trimGtinString = (value: string): string =>
  // `>>> 0 > 9`: not a digit, negative values included. An empty string gives
  // NaN, and `NaN >>> 0` is 0: returned as is (nothing to trim).
  (value.charCodeAt(0) - 48) >>> 0 > 9 ||
  (value.charCodeAt(value.length - 1) - 48) >>> 0 > 9
    ? value.trim()
    : value;

/**
 * Whether a string contains only ASCII digits (`true` for an empty string).
 *
 * @internal
 */
export const isDigitsOnly = (code: string): boolean => {
  for (let i = 0; i < code.length; i++) {
    if ((code.charCodeAt(i) - 48) >>> 0 > 9) {
      return false;
    }
  }
  return true;
};

/**
 * Resolved `minLength` option (default 8).
 *
 * @internal
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const getMinLength = (options?: { minLength?: number }): number => {
  const minLength = options?.minLength ?? 8;
  if (!Number.isInteger(minLength) || minLength < 1 || minLength > 14) {
    throw new RangeError(
      `minLength must be an integer between 1 and 14, got: ${minLength}`
    );
  }
  return minLength;
};

/** readGtinDigits failure: not a string, number or bigint */
export const DIGITS_INVALID_TYPE = 0;
/** readGtinDigits failure: negative, unsafe or non integer number, negative bigint */
export const DIGITS_INVALID_FORMAT = 1;
/**
 * readGtinDigits failure: less than minLength or more than 14 digits (or
 * chars for a string: its digits aren't scanned, see isDigitsOnly)
 */
export const DIGITS_INVALID_LENGTH = 2;

export type GtinDigitsFailure =
  | typeof DIGITS_INVALID_TYPE
  | typeof DIGITS_INVALID_FORMAT
  | typeof DIGITS_INVALID_LENGTH;

/**
 * Convert a string (trimmed when `trim`), number or bigint to its digits
 * (between minLength and 14 chars, not padded), or the reason it can't be.
 * Strings are not scanned: their digits are NOT validated (see
 * hasValidGtinCheckDigit), and an out of range one is a length failure even with
 * non digit chars (kept out of this hot path, see parseGtin).
 *
 * @internal
 */
export const readGtinDigits = (
  value: unknown,
  minLength: number,
  trim: boolean
): string | GtinDigitsFailure => {
  let digits: string;
  if (typeof value === "string") {
    digits = trim ? trimGtinString(value) : value;
    if (digits.length < minLength || digits.length > 14) {
      return DIGITS_INVALID_LENGTH;
    }
    return digits;
  }
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value < 0) {
      return DIGITS_INVALID_FORMAT;
    }
    digits = String(value);
  } else if (typeof value === "bigint") {
    if (value < 0n) {
      return DIGITS_INVALID_FORMAT;
    }
    digits = value.toString();
  } else {
    return DIGITS_INVALID_TYPE;
  }
  return digits.length < minLength || digits.length > 14
    ? DIGITS_INVALID_LENGTH
    : digits;
};

/**
 * Convert a string (trimmed unless `trim: false`), number or bigint to its
 * digits (between minLength and 14 chars, not padded). Digits are NOT
 * validated (see hasValidGtinCheckDigit).
 *
 * @internal
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const toGtinDigits = (
  value: unknown,
  options?: NormalizeGtinOptions
): string | null => {
  const digits = readGtinDigits(
    value,
    getMinLength(options),
    options?.trim !== false
  );
  return typeof digits === "string" ? digits : null;
};

/**
 * Digits to the given length: as is when already there (no allocation),
 * left-padded, or without their extra leading digits (the caller ensures they
 * are zeros).
 *
 * @internal
 */
export const toLength = <T extends string>(
  digits: string,
  length: number
): T => {
  const extra = digits.length - length;
  if (extra === 0) {
    return digits as T;
  }
  return (extra > 0 ? digits.slice(extra) : digits.padStart(length, "0")) as T;
};
