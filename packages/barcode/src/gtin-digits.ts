import type { NormalizeGtinOptions } from "./normalize-gtin";

/**
 * Convert a string, number or bigint to its digits (between minLength and 14
 * chars, not padded). Digits are NOT validated (see isValidGtinDigits).
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
    digits = value;
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
