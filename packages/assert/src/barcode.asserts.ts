import { isEan13 } from './barcode.guards';
import type { Ean13 } from './barcode.types';
import { formatErrMsg } from './messages/errorMessages';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
/**
 * Assert string is not empty (trims the string by default)
 * @throws TypeError
 */
export function assertEan13(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is Ean13 {
  if (!isEan13(v)) {
    throw createAssertException(msgOrErrorFactory, formatErrMsg('ean13', v));
  }
}
