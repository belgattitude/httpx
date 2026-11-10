/* oxlint-disable unicorn/prefer-code-point, no-bitwise -- hot path, same as gtin-check-digit.ts: charCodeAt and a single unsigned comparison to check a digit */
import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import type { UpcEDetectionMode } from "./types";

/**
 * Whether a 12 digit UPC-A starts with `0000`: its GTIN-14 form has 6 leading
 * zeros, it's an EAN-8 (GS1-8 range), not a UPC-A.
 *
 * @internal
 */
export const isUpcAInGtin8Range = (upca: string): boolean =>
  upca.startsWith("0000");

/**
 * Expand a UPC-E (8 chars) to its UPC-A (12 chars, check digit kept as is).
 * Returns `null` when the number system isn't 0 or 1, or when the UPC-A would
 * start with `0000`: the GTIN-8 range (same GTIN-14 as an EAN-8, ie:
 * "000010000007" is the EAN-8 "10000007"), no UPC-A is issued there. Digits
 * and check digit are NOT validated (see hasValidGtinCheckDigit on the result).
 *
 * Expansion, from the last data digit (d6) of `S d1 d2 d3 d4 d5 d6 C`:
 *  - 0, 1, 2: `S d1 d2 d6 0000 d3 d4 d5 C`
 *  - 3:       `S d1 d2 d3 00000 d4 d5 C`
 *  - 4:       `S d1 d2 d3 d4 00000 d5 C`
 *  - 5 to 9:  `S d1 d2 d3 d4 d5 0000 d6 C`
 *
 * @internal
 */
export const expandUpcEDigits = (upce: string): string | null => {
  const system = upce.charAt(0);
  if (upce.length !== 8 || (system !== "0" && system !== "1")) {
    return null;
  }
  const d = upce.slice(1, 7);
  const last = upce.charAt(6);
  let body: string;
  if (last === "0" || last === "1" || last === "2") {
    body = `${d.slice(0, 2)}${last}0000${d.slice(2, 5)}`;
  } else if (last === "3") {
    body = `${d.slice(0, 3)}00000${d.slice(3, 5)}`;
  } else if (last === "4") {
    body = `${d.slice(0, 4)}00000${d.charAt(4)}`;
  } else {
    body = `${d.slice(0, 5)}0000${last}`;
  }
  const upca = `${system}${body}${upce.charAt(7)}`;
  return isUpcAInGtin8Range(upca) ? null : upca;
};

/**
 * Whether 8 chars are a valid UPC-E: digits only, number system 0 or 1, not
 * expanding to the GTIN-8 range (UPC-A starting with `0000`) and matching the
 * check digit of the expanded UPC-A.
 *
 * Perf notes (see bench/upce.bench.ts): the check digit is computed on the 8
 * chars, without expanding (no slicing nor allocation), with the weights the
 * digits have in the UPC-A (3 on even indexes, 1 on odd ones, see
 * expandUpcEDigits for their position). `S d1 d2` are always at index 0 to 2.
 *
 * A valid UPC-E is never a restricted circulation number: its UPC-A starts
 * with 0 or 1 (restricted ones with 2 or 4) and the GTIN-8 range is refused.
 *
 * @internal
 */
export const isValidUpcEDigits = (code: string): boolean => {
  if (code.length !== 8) {
    return false;
  }
  const s = code.charCodeAt(0) - 48;
  const d1 = code.charCodeAt(1) - 48;
  const d2 = code.charCodeAt(2) - 48;
  const d3 = code.charCodeAt(3) - 48;
  const d4 = code.charCodeAt(4) - 48;
  const d5 = code.charCodeAt(5) - 48;
  const d6 = code.charCodeAt(6) - 48;
  const check = code.charCodeAt(7) - 48;
  if (
    s >>> 0 > 1 ||
    d1 >>> 0 > 9 ||
    d2 >>> 0 > 9 ||
    d3 >>> 0 > 9 ||
    d4 >>> 0 > 9 ||
    d5 >>> 0 > 9 ||
    d6 >>> 0 > 9 ||
    check >>> 0 > 9
  ) {
    return false;
  }
  let sum = s * 3 + d1 + d2 * 3 + check;
  // digit at index 3 of the UPC-A
  let fourth = d3;
  if (d6 <= 2) {
    // S d1 d2 d6 0000 d3 d4 d5 C
    fourth = d6;
    sum += d6 + d3 * 3 + d4 + d5 * 3;
  } else if (d6 === 3) {
    // S d1 d2 d3 00000 d4 d5 C
    sum += d3 + d4 + d5 * 3;
  } else if (d6 === 4) {
    // S d1 d2 d3 d4 00000 d5 C
    sum += d3 + d4 * 3 + d5 * 3;
  } else {
    // S d1 d2 d3 d4 d5 0000 d6 C
    sum += d3 + d4 * 3 + d5 + d6 * 3;
  }
  return sum % 10 === 0 && (s | d1 | d2 | fourth) !== 0;
};

/**
 * With `upce: "prefer-ean8"` or `"prefer-upce"`, whether 8 chars can be read
 * as UPC-E. Only with the number system 0, the one of the GS1 General
 * Specifications (UPC-E carries GTIN-12 with the U.P.C. prefix 0): an EAN-8
 * starting with 0 is restricted circulation (ie: an in-store code), so a
 * regular EAN-8 is never read as UPC-E. The number system 1 (a scanner
 * extension, "UPC-E1") is only read with `upce: true`.
 *
 * 8 digits starting with 0 can still be both a valid UPC-E and a restricted
 * EAN-8 with a valid check digit (always for a UPC-E ending, before its check
 * digit, with 5 to 9: its zeros are inserted in pairs, both check digits are
 * the same):
 *  - `prefer-ean8`: not a candidate, only a code that can't be an EAN-8
 *    (check digit) is read as UPC-E.
 *  - `prefer-upce`: a candidate.
 *
 * They are a UPC-E when they are also a valid one (isValidUpcEDigits, or the
 * check digit of expandUpcEDigits: parseGtin needs the expanded value
 * anyway), an EAN-8 otherwise.
 *
 * @internal
 */
export const isUpcECandidate = (
  code: string,
  mode: UpcEDetectionMode
): boolean =>
  code.charCodeAt(0) === 48 &&
  (mode === "prefer-upce" || !hasValidGtinCheckDigit(code));
