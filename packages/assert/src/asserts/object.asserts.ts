import { isPlainObject } from '../guards';
import { errorMessages } from '../messages/errorMessages';
import type { MsgOrErrorFactory } from '../types/internal.types';
import { createAssertException } from '../utils/createAssertException';

/**
 * Assert string is not empty (trims the string by default)
 */
export function assertPlainObject(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is string {
  if (!isPlainObject(v)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.plainObject);
  }
}
