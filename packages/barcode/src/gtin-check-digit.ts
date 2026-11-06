/* oxlint-disable unicorn/prefer-code-point, no-bitwise -- hot path: charCodeAt always returns a number for in-range indexes (no surrogate handling needed for ASCII digits) and is measurably faster; `>>> 0` checks a 0-9 range in one comparison */
/**
 * Whether a code contains only digits and its last digit matches the GS1
 * mod-10 check digit. The length is not checked (expected >= 2).
 *
 * Perf notes (see bench/README.md): digits are validated and summed in a
 * single pass, two at a time from the right (weights 3 and 1), without
 * regexp, slicing or allocation. `charCodeAt` is used over `codePointAt`
 * (no surrogate handling, always returns a number for in-range indexes) and
 * a digit is checked with a single unsigned comparison (`d >>> 0 > 9` is true
 * for negative values too).
 *
 * @internal
 */
export const hasValidGtinCheckDigit = (code: string): boolean => {
  const last = code.length - 1;
  let weighted3 = 0;
  let weighted1 = 0;
  let i = last - 1;
  for (; i > 0; i -= 2) {
    const a = code.charCodeAt(i) - 48;
    const b = code.charCodeAt(i - 1) - 48;
    if (a >>> 0 > 9 || b >>> 0 > 9) {
      return false;
    }
    weighted3 += a;
    weighted1 += b;
  }
  if (i === 0) {
    const a = code.charCodeAt(0) - 48;
    if (a >>> 0 > 9) {
      return false;
    }
    weighted3 += a;
  }
  const check = code.charCodeAt(last) - 48;
  // the weighted sum including the check digit must be a multiple of 10
  return check >>> 0 <= 9 && (weighted3 * 3 + weighted1 + check) % 10 === 0;
};
