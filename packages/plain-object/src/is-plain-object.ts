import type { BasePlainObject, DefaultBasePlainObject } from './internal.types';
import type { PlainObject } from './plain-object.types';
import type { WithoutStaticBuiltInClass } from './static-built-in-class.types';

/**
 * Check if a value is a plain object
 *
 * A plain object is a basic JavaScript object, such as {}, { data: [] }, new Object() or Object.create(null).
 *
 * @example
 * ```typescript
 * import { isPlainObject } from '@httpx/plain-object';
 *
 * // ✅👇 True
 *
 * isPlainObject({ });                       // ✅
 * isPlainObject({ key: 'value' });          // ✅
 * isPlainObject({ key: new Date() });       // ✅
 * isPlainObject(new Object());              // ✅
 * isPlainObject(Object.create(null));       // ✅
 * isPlainObject({ nested: { key: true} });  // ✅
 * isPlainObject(new Proxy({}, {}));         // ✅
 * isPlainObject({ [Symbol('tag')]: 'A' });  // ✅
 *
 * // ✅👇 (node context, workers, ...)
 * const runInNewContext = await import('node:vm').then(
 *     (mod) => mod.runInNewContext
 * );
 * isPlainObject(runInNewContext('({})'));   // ✅
 *
 * // ❌👇 False
 *
 * class Test { };
 * isPlainObject(new Test())           // ❌
 * isPlainObject(10);                  // ❌
 * isPlainObject(null);                // ❌
 * isPlainObject('hello');             // ❌
 * isPlainObject([]);                  // ❌
 * isPlainObject(new Date());          // ❌
 * isPlainObject(new Uint8Array([1])); // ❌
 * isPlainObject(Buffer.from('ABC'));  // ❌
 * isPlainObject(Promise.resolve({})); // ❌
 * isPlainObject(Object.create({}));   // ❌
 * isPlainObject(new (class Cls {}));  // ❌
 * isPlainObject(globalThis);          // ❌
 *
 * // ⚠️👇 Note that at runtime static built-in classes will return true
 * // but the typing guards will prevent you from passing them.
 * // This is a trade-off to keep the isPlainObject as performant as possible
 * // while preventing accidental usage of static built-in classes (edge case).
 *
 * isPlainObject(Math);                // ⚠️️ Typecheck error
 * isPlainObject(JSON);                // ⚠️ Typecheck error
 * isPlainObject(Atomics);             // ⚠️ Typecheck error
 * ```
 */
export const isPlainObject = <
  /** Custom type of the plain object values, DefaultBasePlainObject by default */
  TValue extends BasePlainObject = DefaultBasePlainObject,
  /**
   * Do not set second generic, its purpose is to prevent allowing static
   * built-in classes like Math, JSON, Atomics
   */
  TAnyInput = unknown,
>(
  v: TAnyInput & WithoutStaticBuiltInClass<TAnyInput>
): v is (TAnyInput & WithoutStaticBuiltInClass<TAnyInput>) &
  (TValue extends DefaultBasePlainObject
    ? BasePlainObject
    : PlainObject<TValue>) => {
  if (v === null || typeof v !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(v) as typeof Object.prototype | null;
  return (
    proto === null ||
    proto === Object.prototype ||
    // Required to support node:vm.runInNewContext({})
    Object.getPrototypeOf(proto) === null
  );
};
