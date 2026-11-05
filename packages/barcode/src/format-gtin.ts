import { isGtin } from "./is-gtin";
import type { GtinByLength, GtinLength } from "./types";

/**
 * Format a valid GTIN (8, 12, 13 or 14 digits) to another length, by adding
 * or removing leading zeros. Returns `null` when the input isn't a valid GTIN
 * or when it can't be represented in the requested length (removing a
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
 * ```
 */
export const formatGtin = <TLength extends GtinLength>(
  gtin: string,
  length: TLength
): GtinByLength[TLength] | null => {
  if (!isGtin(gtin)) {
    return null;
  }
  const extra = gtin.length - length;
  if (extra <= 0) {
    return gtin.padStart(length, "0") as GtinByLength[TLength];
  }
  for (let i = 0; i < extra; i++) {
    if (gtin[i] !== "0") {
      return null;
    }
  }
  return gtin.slice(extra) as GtinByLength[TLength];
};
