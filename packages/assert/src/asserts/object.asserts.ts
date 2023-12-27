import { isPlainObject } from '../guards/object.guards';
import { errorMessages } from '../messages/errorMessages';
import type { MsgOrErrorFactory } from '../types/internal.types';
import { createAssertException } from '../utils/createAssertException';

/**
 * Assert a value is a plain object
 */
export function assertPlainObject(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is string {
  if (!isPlainObject(v)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.plainObject);
  }
}
