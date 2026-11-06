import { isValidGtinDigits } from "./gtin-validate";
import type { GtinValidationOptions } from "./types";

export type BarcodeType = "ean8" | "upca" | "ean13" | "gtin14";

/**
 * Format of a barcode as given: a `BarcodeType` or `"upce"` (UPC-E, the
 * zero-suppressed form of a UPC-A)
 */
export type BarcodeFormat = BarcodeType | "upce";

/**
 * Number of digits of each barcode type
 * @internal
 */
export const barcodeTypeLengths = {
  ean8: 8,
  upca: 12,
  ean13: 13,
  gtin14: 14,
} as const satisfies Record<BarcodeType, number>;

/**
 * Barcode type of a given length (8, 12, 13 or 14), `null` for other lengths
 * @internal
 */
export const getBarcodeTypeByLength = (length: number): BarcodeType | null => {
  // most common first
  switch (length) {
    case 13: {
      return "ean13";
    }
    case 12: {
      return "upca";
    }
    case 8: {
      return "ean8";
    }
    case 14: {
      return "gtin14";
    }
    default: {
      return null;
    }
  }
};

/**
 * Detect the type of a barcode from its value. Returns `null` when the code
 * doesn't match any supported type, its check digit is invalid or it's a
 * restricted circulation number (unless `acceptRestricted` is set).
 *
 * Detection is based on the length (8: ean8, 12: upca, 13: ean13, 14: gtin14)
 * and the GS1 mod-10 check digit. The code must contain only digits (no
 * spaces, dashes or trimming): like the type guards, it validates the value
 * as is, use `parseGtin` for untrusted input.
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
 * detectBarcodeType(" 4006381333931"); // 👈 null (never trimmed)
 * ```
 */
export const detectBarcodeType = (
  code: string,
  options?: GtinValidationOptions
): BarcodeType | null => {
  if (typeof code !== "string") {
    return null;
  }
  const type = getBarcodeTypeByLength(code.length);
  return type !== null && isValidGtinDigits(code, options) ? type : null;
};
