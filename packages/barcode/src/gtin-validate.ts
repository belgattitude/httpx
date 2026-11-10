/* oxlint-disable unicorn/prefer-code-point -- hot path: charCodeAt always returns a number for in-range indexes (no surrogate handling needed for ASCII digits) and is measurably faster */

// char codes
const ZERO = 48;
const TWO = 50;
const FOUR = 52;

/**
 * Whether a digits-only code (1 to 14 digits) is a GS1 Restricted Circulation
 * Number (RCN). The check digit isn't verified.
 *
 * Checked on the GTIN-14 form (right-aligned, missing leading digits are
 * zeros) without padding. This keeps every function consistent, ie:
 * "01234565" (EAN-8), "000001234565" (UPC-A) and the number 1234565 all share
 * the same GTIN-14 "00000001234565".
 *
 * Ranges:
 *  - GTIN-8 form (6 leading zeros) starting with 0 or 2.
 *  - otherwise, GS1 Prefix of the GTIN-13 (after the GTIN-14 indicator)
 *    starting with 2, 02 or 04.
 *
 * @internal
 */
export const isRestrictedGtinDigits = (code: string): boolean => {
  // index of code[0] in the GTIN-14 form
  const offset = 14 - code.length;
  if (offset > 6) {
    // less than 8 significant digits: GTIN-8 starting with 0
    return true;
  }
  // most common first: GS1 Prefix of the GTIN-13 (GTIN-14 index 1 and 2)
  const p1 = offset > 1 ? ZERO : code.charCodeAt(1 - offset);
  if (p1 !== ZERO) {
    return p1 === TWO;
  }
  const p2 = offset > 2 ? ZERO : code.charCodeAt(2 - offset);
  if (p2 !== ZERO) {
    return p2 === TWO || p2 === FOUR;
  }
  // GTIN-8 form if the 6 first digits of the GTIN-14 are zeros (index 1 and
  // 2 already are)
  if (offset === 0 && code.charCodeAt(0) !== ZERO) {
    return false;
  }
  for (let k = Math.max(offset, 3); k < 6; k++) {
    if (code.charCodeAt(k - offset) !== ZERO) {
      return false;
    }
  }
  const first = code.charCodeAt(6 - offset);
  return first === ZERO || first === TWO;
};
