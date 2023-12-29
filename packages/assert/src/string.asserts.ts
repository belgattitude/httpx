import { formatErrMsg } from './messages/errorMessages';
import { isStrNotEmpty } from './string.guards';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * Assert string is not empty (trims the string by default)
 * @throws TypeError
 */
export function assertStrNotEmpty(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: {
    trim: boolean;
  }
): asserts v is string {
  const { trim = true } = options ?? {};
  if (!isStrNotEmpty(v, { trim })) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(
        `non-empty string (with trim: ${trim ? 'true' : 'false'})`,
        v
      )
    );
  }
}
