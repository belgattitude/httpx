import type { MsgOrErrorFactory } from "./assert-utils";
import { throwAssertError } from "./assert-utils";
import { isEan8, isEan13, isGtin14, isUpcA } from "./barcode-guards";
import { isGtin } from "./is-gtin";
import type { Ean8, Ean13, Gtin, Gtin14, UpcA } from "./types";

/**
 * Assert a value is a valid EAN-13 (13 digits, valid check digit).
 *
 * @example
 * ```typescript
 * assertEan13(v); // 👈 throws TypeError('Value is expected to be an EAN-13, got: string(length:12)')
 * assertEan13(v, "Invalid ean"); // 👈 throws TypeError('Invalid ean')
 * assertEan13(v, () => new HttpBadRequest("Invalid ean")); // 👈 throws HttpBadRequest
 * ```
 * @throws TypeError (or the error returned by the factory)
 */
export function assertEan13(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is Ean13 {
  if (!isEan13(v)) {
    throwAssertError(v, "an EAN-13", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid EAN-8 (8 digits, valid check digit).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertEan8(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is Ean8 {
  if (!isEan8(v)) {
    throwAssertError(v, "an EAN-8", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid UPC-A (12 digits, valid check digit).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertUpcA(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is UpcA {
  if (!isUpcA(v)) {
    throwAssertError(v, "a UPC-A", msgOrErrorFactory);
  }
}

/**
 * Assert a value is a valid GTIN-14 (14 digits, valid check digit).
 * @throws TypeError (or the error returned by the factory)
 */
export function assertGtin14(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is Gtin14 {
  if (!isGtin14(v)) {
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
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is Gtin {
  if (!isGtin(v)) {
    throwAssertError(v, "a GTIN", msgOrErrorFactory);
  }
}
