import { hasValidGtinCheckDigit } from "./gtin-check-digit";

/**
 * Whether a digits-only code is (or contains, once left-padded) an EAN-8
 * (GTIN-8) starting with 0 or 2. Those prefixes are reserved by GS1 for
 * restricted circulation numbers (RCN-8), only meaningful within a company.
 *
 * Checked on the GTIN-14 form (right-aligned): the 8 last digits form an
 * EAN-8 when all the digits before them are zeros. This keeps every function
 * consistent, ie: "01234565" (EAN-8), "000001234565" (UPC-A) and the number
 * 1234565 all share the same GTIN-14 "00000001234565".
 *
 * @internal
 */
export const isRestrictedGtin8 = (code: string): boolean => {
  const ean8Start = code.length - 8;
  for (let i = 0; i < ean8Start; i++) {
    if (code[i] !== "0") {
      return false;
    }
  }
  const first = code[ean8Start];
  return first === "0" || first === "2";
};

/**
 * Digits only, valid check digit and not a restricted circulation EAN-8.
 * The length is not checked (expected >= 8).
 *
 * @internal
 */
export const isValidGtinDigits = (code: string): boolean =>
  hasValidGtinCheckDigit(code) && !isRestrictedGtin8(code);
