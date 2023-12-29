import { isArrayNotEmpty } from './array.guards';
import type { ArrayNotEmpty } from './array.types';
import { formatErrMsg } from './messages/errorMessages';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
/**
 * Assert string is not empty (trims the string by default)
 * @throws TypeError
 */
export function assertArrayNotEmpty<T = unknown>(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is ArrayNotEmpty<T> {
  if (!isArrayNotEmpty(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('non-empty array', v)
    );
  }
}
