import type { NormalizeGtinOptions } from "./normalize-gtin";

/**
 * Convert a string, number or bigint to a 14 chars string, left-padded with
 * zeros. Digits are NOT validated (see isValidGtinDigits).
 *
 * @internal
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const padToGtin14 = (
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
  if (digits.length < minLength || digits.length > 14) {
    return null;
  }
  return digits.padStart(14, "0");
};
