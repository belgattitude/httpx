import { formatErrMsg } from './messages/errorMessages';
import { isNumberSafeInt } from './number.guards';
import type { NumberSafeInt } from './number.types';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
/**
 * Assert string is not empty (trims the string by default)
 * @throws TypeError
 */
export function assertNumberSafeInt(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is NumberSafeInt {
  if (!isNumberSafeInt(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('safe integer', v)
    );
  }
}
