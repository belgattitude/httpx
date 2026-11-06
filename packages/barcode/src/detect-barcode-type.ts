import { trimGtinString } from "./gtin-digits";
import { isValidGtinDigits } from "./gtin-validate";
import type { GtinTrimOptions, GtinValidationOptions } from "./types";

export type BarcodeType = "ean8" | "upca" | "ean13" | "gtin14";

/**
 * Format of a barcode as given: a `BarcodeType` or `"upce"` (UPC-E, the
 * zero-suppressed form of a UPC-A)
 */
export type BarcodeFormat = BarcodeType | "upce";

/**
 * Detect the type of a barcode from its value. Returns `null` when the code
 * doesn't match any supported type, its check digit is invalid or it's a
 * restricted circulation number (unless `acceptRestricted` is set).
 *
 * Detection is based on the length (8: ean8, 12: upca, 13: ean13, 14: gtin14)
 * and the GS1 mod-10 check digit. The code must contain only digits (no
 * spaces or dashes), leading and trailing whitespace is trimmed unless
 * `trim: false`.
 *
 * Note that a 13-digit code starting with `0` (an UPC-A expressed as EAN-13)
 * is detected as `ean13`. 8 digits are detected as `ean8`, use `isUpcE` (or
 * `parseGtin` with `upce: true`) when the source is known to be UPC-E.
 *
 * @example
 * ```typescript
 * detectBarcodeType("4006381333931"); // 👈 "ean13"
 * detectBarcodeType("96385074"); // 👈 "ean8"
 * detectBarcodeType("036000291452"); // 👈 "upca"
 * detectBarcodeType("10012345678902"); // 👈 "gtin14"
 * detectBarcodeType("4006381333932"); // 👈 null (invalid check digit)
 * detectBarcodeType("2123456789010"); // 👈 null (restricted circulation)
 * detectBarcodeType("2123456789010", { acceptRestricted: true }); // 👈 "ean13"
 * detectBarcodeType(" 4006381333931\n"); // 👈 "ean13" (trimmed)
 * detectBarcodeType(" 4006381333931", { trim: false }); // 👈 null
 * ```
 */
export const detectBarcodeType = (
  code: string,
  options?: GtinValidationOptions & GtinTrimOptions
): BarcodeType | null => {
  if (typeof code !== "string") {
    return null;
  }
  const value = options?.trim === false ? code : trimGtinString(code);
  let type: BarcodeType;
  // most common first
  switch (value.length) {
    case 13: {
      type = "ean13";
      break;
    }
    case 12: {
      type = "upca";
      break;
    }
    case 8: {
      type = "ean8";
      break;
    }
    case 14: {
      type = "gtin14";
      break;
    }
    default: {
      return null;
    }
  }
  return isValidGtinDigits(value, options) ? type : null;
};
