import { formatErrMsg } from './messages/errorMessages';
import { isPlainObject } from './object.guards';
import type {
  BasePlainObject,
  UnspecifiedPlainObjectType,
} from './object.internal.types';
import type { PlainObject } from './object.types';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * Assert a value is a plain object
 * @throws TypeError
 */
export function assertPlainObject<
  TValue extends Record<string, unknown> = UnspecifiedPlainObjectType,
>(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is TValue extends UnspecifiedPlainObjectType
  ? BasePlainObject
  : PlainObject<TValue> {
  if (!isPlainObject<TValue>(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('plain object', v)
    );
  }
}
