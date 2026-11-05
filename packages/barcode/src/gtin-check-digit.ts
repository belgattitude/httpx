/**
 * Whether a code contains only digits and its last digit matches the GS1
 * mod-10 check digit. The length is not checked (expected >= 2).
 *
 * Perf notes (see bench/README.md): digits are validated and summed in a
 * single pass, two at a time from the right (weights 3 and 1), without
 * regexp, slicing or allocation.
 *
 * @internal
 */
export const hasValidGtinCheckDigit = (code: string): boolean => {
  const last = code.length - 1;
  let weighted3 = 0;
  let weighted1 = 0;
  let i = last - 1;
  for (; i > 0; i -= 2) {
    const a = (code.codePointAt(i) ?? -1) - 48;
    const b = (code.codePointAt(i - 1) ?? -1) - 48;
    if (a < 0 || a > 9 || b < 0 || b > 9) {
      return false;
    }
    weighted3 += a;
    weighted1 += b;
  }
  if (i === 0) {
    const a = (code.codePointAt(0) ?? -1) - 48;
    if (a < 0 || a > 9) {
      return false;
    }
    weighted3 += a;
  }
  const check = (code.codePointAt(last) ?? -1) - 48;
  return (
    check >= 0 &&
    check <= 9 &&
    (10 - ((weighted3 * 3 + weighted1) % 10)) % 10 === check
  );
};
