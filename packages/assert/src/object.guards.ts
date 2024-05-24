import type {
  BasePlainObject,
  UnspecifiedPlainObjectType,
} from './object.internal.types';
import type { PlainObject } from './object.types';

/**
 * Check if a value is a plain object
 *
 * An object is plain if it's created by either {}, new Object(), or Object.create(null).
 *
 * @example
 * ```typescript
 * isPlainObject({ key: 'value' });       // 👈 ✅ true
 * isPlainObject({ key: new Date() });    // 👈 ✅ true
 * isPlainObject(new Object());           // 👈 ✅ true
 * isPlainObject(Object.create(null));    // 👈 ✅ true
 * isPlainObject({nested: { key: true} }  // 👈 ✅ true
 *
 * class Test { };
 *
 * isPlainObject(new Test())              // 👈 ❌ false
 * isPlainObject(10);                     // 👈 ❌ false
 * isPlainObject(null);                   // 👈 ❌ false
 * isPlainObject('hello');                // 👈 ❌ false
 * isPlainObject([]);                     // 👈 ❌ false
 * isPlainObject(new Date());             // 👈 ❌ false
 * isPlainObject(Math);                   // 👈 ❌ false
 * (...)
 */
export const isPlainObject = <
  TValue extends Record<string, unknown> = UnspecifiedPlainObjectType,
>(
  v: unknown
): v is TValue extends UnspecifiedPlainObjectType
  ? BasePlainObject
  : PlainObject<TValue> => {
  if (v === null || typeof v !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(v) as typeof Object.prototype | null;
  return (
    (proto === null ||
      proto === Object.prototype ||
      Object.getPrototypeOf(proto) === null) &&
    // https://stackoverflow.com/a/76387885/5490184
    !(Symbol.toStringTag in v) &&
    !(Symbol.iterator in v)
  );
};
