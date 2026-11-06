import type { MsgOrErrorFactory } from "./assert-utils";
import { throwAssertError } from "./assert-utils";
import { isEan8, isEan13, isGtin14, isUpcA, isUpcE } from "./barcode-guards";
import { isGtin } from "./is-gtin";
import type {
  Ean8,
  Ean13,
  Gtin,
  Gtin14,
  GtinValidationOptions,
  UpcA,
  UpcE,
} from "./types";

/**
 * Assert a value is a valid EAN-13 (13 digits, valid check digit).
 *
 * @example
 * ```typescript
 * assertEan13(v); // 👈 throws TypeError('Value is expected to be an EAN-13, got: string(length:12)')
 * assertEan13(v, "Invalid ean"); // 👈 throws TypeError('Invalid ean')
 * assertEan13(v, () => new HttpBadRequest("Invalid ean")); // 👈 throws HttpBadRequest
 * assertEan13(v, undefined, { acceptRestricted: true }); // 👈 accept restricted circulation numbers
 * ```
 * @throws TypeError (or the error returned by the factory)
 */
export function assertEan13(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: GtinValidationOptions
): asserts v is Ean13 {
  if (!isEan13(v, options)) {
    throwAssertError(v, "an EAN-13", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid EAN-8 (8 digits, valid check digit).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertEan8(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: GtinValidationOptions
): asserts v is Ean8 {
  if (!isEan8(v, options)) {
    throwAssertError(v, "an EAN-8", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid UPC-A (12 digits, valid check digit).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertUpcA(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: GtinValidationOptions
): asserts v is UpcA {
  if (!isUpcA(v, options)) {
    throwAssertError(v, "a UPC-A", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid UPC-E (8 digits, number system 0 or 1, valid
 * check digit of the expanded UPC-A).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertUpcE(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: GtinValidationOptions
): asserts v is UpcE {
  if (!isUpcE(v, options)) {
    throwAssertError(v, "a UPC-E", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid GTIN-14 (14 digits, valid check digit).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertGtin14(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: GtinValidationOptions
): asserts v is Gtin14 {
  if (!isGtin14(v, options)) {
    throwAssertError(v, "a GTIN-14", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid GTIN (GTIN-8, GTIN-12/UPC-A, GTIN-13/EAN-13 or
 * GTIN-14).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertGtin(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: GtinValidationOptions
): asserts v is Gtin {
  if (!isGtin(v, options)) {
    throwAssertError(v, "a GTIN", msgOrErrorFactory);
  }
}
