import type {
  BasePlainObject,
  DefaultBasePlainObject,
  MsgOrErrorFactory,
  StaticBuiltInNamespaceCheck,
} from "./internal.types";
import { isPlainObject } from "./is-plain-object";
import type { PlainObject } from "./plain-object.types";

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
  TInput = unknown,
>(
  // The asserted type is kept in the union to stay assignable to the parameter
  v:
    | TInput
    | NoInfer<
        TValue extends DefaultBasePlainObject
          ? BasePlainObject
          : PlainObject<TValue>
      >,
  ...rest: StaticBuiltInNamespaceCheck<TInput> extends []
    ? [msgOrErrorFactory?: MsgOrErrorFactory]
    : [
        msgOrErrorFactory: MsgOrErrorFactory | undefined,
        ...StaticBuiltInNamespaceCheck<TInput>,
      ]
): asserts v is TValue extends DefaultBasePlainObject
  ? BasePlainObject
  : PlainObject<TValue>;
export function assertPlainObject(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): void {
  if (!isPlainObject(v)) {
    if (
      msgOrErrorFactory === undefined ||
      typeof msgOrErrorFactory === "string"
    ) {
      throw new TypeError(msgOrErrorFactory ?? `Not a PlainObject`);
    }
    throw msgOrErrorFactory();
  }
}
