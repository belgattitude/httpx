import { formatErrMsg } from './messages/errorMessages';
import { isPlainObject } from './object.guards';
import type { PlainObject } from './object.types';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * Assert a value is a plain object
 * @throws TypeError
 */
export function assertPlainObject<
  TValue extends Record<string, unknown> = Record<string, unknown>,
>(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is PlainObject<TValue> {
  if (!isPlainObject<TValue>(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('plain object', v)
    );
  }
}
