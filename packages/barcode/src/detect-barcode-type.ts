import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import type { UpcEOptions } from "./types";
import { isUpcECandidate, isValidUpcEDigits } from "./upce-digits";

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

export type DetectBarcodeTypeOptions = UpcEOptions;

/**
 * `detectBarcodeType` signatures: `"upce"` is only possible with the `upce`
 * option
 */
type DetectBarcodeType = {
  (code: string, options?: { upce?: false }): BarcodeType | null;
  (code: string, options?: DetectBarcodeTypeOptions): BarcodeFormat | null;
};

/**
 * Detect the type of a barcode from its value. Returns `null` when the code
 * doesn't match any supported type or its check digit is invalid.
 *
 * Detection is based on the length (8: ean8, 12: upca, 13: ean13, 14: gtin14)
 * and the GS1 mod-10 check digit. The code must contain only digits (no
 * spaces, dashes or trimming): like the type guards, it validates the value
 * as is, use `parseGtin` for untrusted input.
 *
 * Like `parseGtin`, restricted circulation numbers (in-store codes) are
 * detected: use `isInStoreGtin` (or the `category` of `parseGtin`)
 * to tell them apart.
 *
 * 8 digits are detected as `ean8` unless the `upce` option is set:
 *  - `upce: true`: as `upce` (UPC-E, check digit of the expanded UPC-A), when
 *    the source is known to be UPC-E.
 *  - `upce: "prefer-ean8"` or `"prefer-upce"`: as `upce` when it starts
 *    with `0` (the GS1 UPC-E number system) and is a valid UPC-E, as `ean8`
 *    otherwise. When it's also an in-store EAN-8 with a valid check digit,
 *    `"prefer-ean8"` (safest) keeps it an `ean8`, `"prefer-upce"` detects
 *    `upce`. UPC-E with the number system `1` (ie: `10000168`) are only
 *    detected with `true`.
 *
 * Note that a 13-digit code starting with `0` (an UPC-A expressed as EAN-13)
 * is detected as `ean13`.
 *
 * @example
 * ```typescript
 * detectBarcodeType("4006381333931"); // 👈 "ean13"
 * detectBarcodeType("96385074"); // 👈 "ean8"
 * detectBarcodeType("036000291452"); // 👈 "upca"
 * detectBarcodeType("10012345678902"); // 👈 "gtin14"
 * detectBarcodeType("4006381333932"); // 👈 null (invalid check digit)
 * detectBarcodeType("2123456789010"); // 👈 "ean13" (in-store code)
 * detectBarcodeType(" 4006381333931"); // 👈 null (never trimmed)
 * detectBarcodeType("04252614"); // 👈 null (invalid EAN-8 check digit)
 * detectBarcodeType("04252614", { upce: "prefer-ean8" }); // 👈 "upce"
 * detectBarcodeType("96385074", { upce: "prefer-ean8" }); // 👈 "ean8"
 * detectBarcodeType("01234565", { upce: "prefer-ean8" }); // 👈 "ean8" (also an in-store EAN-8)
 * detectBarcodeType("01234565", { upce: "prefer-upce" }); // 👈 "upce"
 * ```
 */
export const detectBarcodeType = ((
  code: string,
  options?: DetectBarcodeTypeOptions
): BarcodeFormat | null => {
  if (typeof code !== "string") {
    return null;
  }
  const upce = options?.upce;
  if (upce === true && code.length === 8) {
    return isValidUpcEDigits(code) ? "upce" : null;
  }
  // length checked first (isValidUpcEDigits): other codes exit at once
  if (
    (upce === "prefer-ean8" || upce === "prefer-upce") &&
    isValidUpcEDigits(code) &&
    isUpcECandidate(code, upce)
  ) {
    return "upce";
  }
  const type = getBarcodeTypeByLength(code.length);
  return type !== null && hasValidGtinCheckDigit(code) ? type : null;
}) as DetectBarcodeType;
