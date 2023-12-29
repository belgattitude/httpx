import { formatErrMsg } from './messages/errorMessages';
import { isPlainObject } from './object.guards';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * Assert a value is a plain object
 * @throws TypeError
 */
export function assertPlainObject(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is string {
  if (!isPlainObject(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('plain object', v)
    );
  }
}
