import { isArrayNonEmpty } from './array.guards';
import type { ArrayNonEmpty } from './array.types';
import { formatErrMsg } from './messages/errorMessages';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
/**
 * Assert string is not empty (trims the string by default)
 * @throws TypeError
 */
export function assertArrayNonEmpty<T = unknown>(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is ArrayNonEmpty<T> {
  if (!isArrayNonEmpty(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('non-empty array', v)
    );
  }
}
