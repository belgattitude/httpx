import { formatGtin } from "./format-gtin";
import { trimGtinString } from "./gtin-digits";
import { isValidGtinDigits } from "./gtin-validate";
import type {
  GtinTrimOptions,
  GtinValidationOptions,
  UpcA,
  UpcE,
} from "./types";
import { expandUpcEDigits, isUpcAInGtin8Range } from "./upce-digits";

/**
 * Expand a UPC-E (8 digits, zero-suppressed) to its UPC-A (12 digits).
 * Returns `null` when the value isn't a valid UPC-E: not 8 digits, number
 * system other than 0 or 1, invalid check digit (computed on the UPC-A) or
 * expanding to the GTIN-8 range (UPC-A starting with `0000`, the same GTIN as
 * an EAN-8). Leading and trailing whitespace is trimmed unless `trim: false`.
 *
 * @example
 * ```typescript
 * expandUpcE("04252614"); // 👈 "042100005264" (UpcA)
 * expandUpcE("01234565"); // 👈 "012345000065"
 * expandUpcE("04252615"); // 👈 null (invalid check digit)
 * expandUpcE("24252614"); // 👈 null (number system must be 0 or 1)
 * ```
 */
export const expandUpcE = (
  upce: string,
  options?: GtinValidationOptions & GtinTrimOptions
): UpcA | null => {
  if (typeof upce !== "string") {
    return null;
  }
  const upca = expandUpcEDigits(
    options?.trim === false ? upce : trimGtinString(upce)
  );
  return upca !== null && isValidGtinDigits(upca, options)
    ? (upca as UpcA)
    : null;
};

/**
 * Compress a GTIN to its UPC-E (8 digits, zero-suppressed) when possible.
 * Accepts a UPC-A or its EAN-13 / GTIN-14 forms (leading zeros). Returns
 * `null` when the value isn't a valid GTIN, has no UPC-A form (an EAN-13, a
 * GTIN-14 with an indicator, or an EAN-8: its UPC-A form starting with `0000`
 * is the GTIN-8 range), its number system isn't 0 or 1 or it doesn't have the
 * zeros UPC-E can suppress.
 * Leading and trailing whitespace is trimmed unless `trim: false`.
 *
 * @example
 * ```typescript
 * compressUpcA("042100005264"); // 👈 "04252614" (UpcE)
 * compressUpcA("00042100005264"); // 👈 "04252614" (GTIN-14 form)
 * compressUpcA("036000291452"); // 👈 null (no suppressible zeros)
 * compressUpcA("10000007"); // 👈 null (EAN-8, no UPC-A form)
 * ```
 */
export const compressUpcA = (
  gtin: string,
  options?: GtinValidationOptions & GtinTrimOptions
): UpcE | null => {
  const upca = formatGtin(gtin, 12, options);
  if (
    upca === null ||
    !(upca.startsWith("0") || upca.startsWith("1")) ||
    isUpcAInGtin8Range(upca)
  ) {
    return null;
  }
  // manufacturer (5 digits) and product (5 digits) codes
  const m = upca.slice(1, 6);
  const p = upca.slice(6, 11);
  let d: string;
  if (m.endsWith("00") && m.charAt(2) <= "2" && p.startsWith("00")) {
    d = `${m.slice(0, 2)}${p.slice(2)}${m.charAt(2)}`;
  } else if (m.endsWith("00") && p.startsWith("000")) {
    d = `${m.slice(0, 3)}${p.slice(3)}3`;
  } else if (m.endsWith("0") && p.startsWith("0000")) {
    d = `${m.slice(0, 4)}${p.charAt(4)}4`;
  } else if (p.startsWith("0000") && p.charAt(4) >= "5") {
    d = `${m}${p.charAt(4)}`;
  } else {
    return null;
  }
  return `${upca.charAt(0)}${d}${upca.charAt(11)}` as UpcE;
};
