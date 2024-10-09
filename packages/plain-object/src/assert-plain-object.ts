import type {
  BasePlainObject,
  DefaultBasePlainObject,
  MsgOrErrorFactory,
} from './internal.types';
import { isPlainObject } from './is-plain-object';
import type { PlainObject } from './plain-object.types';

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
    if (
      msgOrErrorFactory === undefined ||
      typeof msgOrErrorFactory === 'string'
    ) {
      throw new TypeError(msgOrErrorFactory ?? `Not a PlainObject`);
    }
    throw msgOrErrorFactory();
  }
}
