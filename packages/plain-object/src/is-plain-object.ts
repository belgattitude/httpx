import type { BasePlainObject, DefaultBasePlainObject } from './internal.types';
import type { PlainObject } from './plain-object.types';

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
 *
 * // ⚠️ Edge cases
 * //
 * // 👇 globalThis isn't properly portable across all JS environments
 * //
 *
 * isPlainObject(globalThis);          // ✅ with Bun ❌ otherwise (browser, Nodejs, edge, cloudflare)
 *
 * // 👇 Static built-in classes aren't properly checked. This is a trade-off
 * //    to maintain the best performance and size. If you need to check for these,
 * //    use a custom type guard. But in most cases, you won't need to check for these
 * //    as the probability of writing a code that receives these as plain objects is low.
 * //    and probably indicates an issue in your code.
 *
 * isPlainObject(Math);                // ⚠️✅ return true, but Math is not a plain object
 * isPlainObject(JSON);                // ⚠️✅ return true, but JSON is not a plain object
 * isPlainObject(Atomics);             // ⚠️✅ return true, but Atomics is not a plain object
 * isPlainObject(Reflect);             // ⚠️✅ return true, but Reflect is not a plain object
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
    proto === null ||
    proto === Object.prototype ||
    // Required to support node:vm.runInNewContext({})
    Object.getPrototypeOf(proto) === null
  );
};
