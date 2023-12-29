import { isEan13 } from './barcode.guards';
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
): asserts v is string {
  if (!isEan13(v)) {
    throw createAssertException(msgOrErrorFactory, formatErrMsg('ean13', v));
  }
}
