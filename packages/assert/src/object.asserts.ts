import { formatErrMsg } from './messages/errorMessages';
import { isPlainObject } from './object.guards';
import type {
  BasePlainObject,
  DefaultBasePlainObject,
} from './object.internal.types';
import type { PlainObject } from './object.types';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
/**
 * Assert a value is a plain object
 *
 * @example
 * ```typescript
 * import { assertPlainObject } from '@httpx/plain-object';
 * import type { PlainObject } from '@httpx/plain-object';
 *
 * function fn(value: unknown) {
 *
 *     // 👇 Throws `new TypeError('Not a plain object')` if not a plain object
 *     assertPlainObject(value);
 *
 *     // 👇 Throws `new TypeError('Custom message')` if not a plain object
 *     assertPlainObject(value, 'Custom message');
 *
 *     // 👇 Throws custom error if not a plain object
 *     assertPlainObject(value, () => {
 *         throw new HttpBadRequest('Custom message');
 *     });
 *
 *     return value;
 * }
 *
 * try {
 *     const value = fn({ key: 'value' });
 *     // ✅ Value is known to be PlainObject<unknown>
 *     assertType<PlainObject>(value);
 * } catch (error) {
 *     console.error(error);
 * }
 * ```
 *
 * @throws TypeError
 */
export function assertPlainObject<
  TValue extends BasePlainObject = DefaultBasePlainObject,
>(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is TValue extends DefaultBasePlainObject
  ? BasePlainObject
  : PlainObject<TValue> {
  if (!isPlainObject<TValue>(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('plain object', v)
    );
  }
}
