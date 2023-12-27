import { isStrNotEmpty } from '../guards/string.guards';
import { errorMessages } from '../messages/errorMessages';
import type { MsgOrErrorFactory } from '../types/internal.types';
import { createAssertException } from '../utils/createAssertException';

/**
 * Assert string is not empty (trims the string by default)
 */
export function assertStrNotEmpty(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  /** auto-trim, default true */
  trim = true
): asserts v is string {
  if (!isStrNotEmpty(v, trim)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.strNotEmpty);
  }
}
