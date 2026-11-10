import { toLength, trimGtinString } from "./gtin-digits";
import { isGtin } from "./is-gtin";
import type { GtinByLength, GtinLength, GtinTrimOptions } from "./types";

/**
 * Format a valid GTIN (8, 12, 13 or 14 digits) to another length, by adding
 * or removing leading zeros. Returns `null` when the input isn't a valid GTIN
 * (restricted circulation numbers, in-store codes, are valid GTINs) or when it can't be represented in the requested length (removing a
 * non-zero digit).
 *
 * Typical use: display or print a GTIN stored in its normalized form (see
 * `normalizeGtin`).
 *
 * @example
 * ```typescript
 * formatGtin("00036000291452", 12); // 👈 "036000291452" (UpcA)
 * formatGtin("00036000291452", 13); // 👈 "0036000291452" (Ean13)
 * formatGtin("036000291452", 14); // 👈 "00036000291452" (Gtin14)
 * formatGtin("00000096385074", 8); // 👈 "96385074" (Ean8)
 * formatGtin("04006381333931", 12); // 👈 null (would drop a "4")
 * formatGtin(" 036000291452\n", 14); // 👈 "00036000291452" (trimmed)
 * formatGtin(" 036000291452", 14, { trim: false }); // 👈 null
 * ```
 */
export const formatGtin = <TLength extends GtinLength>(
  gtin: string,
  length: TLength,
  options?: GtinTrimOptions
): GtinByLength[TLength] | null => {
  const value =
    typeof gtin === "string" && options?.trim !== false
      ? trimGtinString(gtin)
      : gtin;
  if (!isGtin(value)) {
    return null;
  }
  // only leading zeros can be removed
  for (let i = 0; i < value.length - length; i++) {
    if (value[i] !== "0") {
      return null;
    }
  }
  return toLength<GtinByLength[TLength]>(value, length);
};
