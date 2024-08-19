import type { BasePlainObject, DefaultBasePlainObject } from './internal.types';
import type { PlainObject } from './plain-object.types';

/**
 * Check if a value is a plain object
 *
 * An object is plain if it's created by either {}, new Object(), or Object.create(null).
 *
 * @example
 * ```typescript
 * import { isPlainObject } from '@httpx/plain-object';
 *
 * // ✅👇 True
 *
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
 * isPlainObject(Math);                // ❌ Static built-in classes
 * isPlainObject(Promise.resolve({})); // ❌
 * isPlainObject(Object.create({}));   // ❌
 * ```
 */
export const isPlainObject = <
  TValue extends BasePlainObject = DefaultBasePlainObject,
>(
  v: unknown
): v is TValue extends DefaultBasePlainObject
  ? BasePlainObject
  : PlainObject<TValue> => {
  if (v === null || typeof v !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(v) as typeof Object.prototype | null;
  return (
    (proto === null ||
      proto === Object.prototype ||
      // Required to support node:vm.runInNewContext({})
      Object.getPrototypeOf(proto) === null) &&
    // https://stackoverflow.com/a/76387885/5490184
    !(Symbol.toStringTag in v) &&
    !(Symbol.iterator in v)
  );
};
