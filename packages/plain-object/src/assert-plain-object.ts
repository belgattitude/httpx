import type { BasePlainObject, DefaultBasePlainObject } from './internal.types';
import type { MsgOrErrorFactory } from './internal.types';
import { isPlainObject } from './is-plain-object';
import type { PlainObject } from './plain-object.types';

/**
 * Assert a value is a plain object
 * @throws TypeError
 */
export function assertPlainObject<
  TValue extends BasePlainObject = DefaultBasePlainObject,
>(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory | undefined
): asserts v is TValue extends DefaultBasePlainObject
  ? BasePlainObject
  : PlainObject<TValue> {
  if (!isPlainObject<TValue>(v)) {
    if (
      msgOrErrorFactory === undefined ||
      typeof msgOrErrorFactory === 'string'
    ) {
      throw new TypeError(msgOrErrorFactory ?? `Not a plain object`);
    }
    throw msgOrErrorFactory();
  }
}
