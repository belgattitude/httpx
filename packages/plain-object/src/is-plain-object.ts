import type {
  BasePlainObject,
  DefaultBasePlainObject,
  StaticBuiltInNamespaceCheck,
} from "./internal.types";
import type { PlainObject } from "./plain-object.types";

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
 * //    In Bun, globalThis is a plain object, but in other environments
 * //    (browser, Nodejs, edge, cloudflare, deno), it's not.
 * //
 * // 👇 process.env isn't properly portable across all JS environments
 * //    In Bun && cloudlfare, process.env is a plain object, but in other environments
 * //    (browser, Nodejs, edge, cloudflare, deno), it's not.
 *
 * isPlainObject(globalThis);          // ✅ with Bun ❌ otherwise (browser, Nodejs, edge, cloudflare, deno)
 * isPlainObject(process.env);         // ✅ with Bun and cloudflare ❌ otherwise (Nodejs, edge, deno)
 *
 * // 👇 Static built-in namespaces aren't checked at runtime. This is a trade-off
 * //    to maintain the best performance and size. When statically known, they
 * //    are rejected at typecheck. If you need a runtime check, use a custom type
 * //    guard. But in most cases, you won't need to check for these as the
 * //    probability of writing a code that receives these as plain objects is low.
 * //    and probably indicates an issue in your code.
 *
 * isPlainObject(Math);                // ⚠️✅ return true, typecheck error
 * isPlainObject(JSON);                // ⚠️✅ return true, typecheck error
 * isPlainObject(Atomics);             // ⚠️✅ return true, typecheck error
 * isPlainObject(Reflect);             // ⚠️✅ return true, typecheck error
 * isPlainObject(Intl);                // ⚠️✅ return true, typecheck error
 * isPlainObject(WebAssembly);         // ⚠️✅ return true, typecheck error
 * isPlainObject(Temporal);            // ⚠️✅ return true, typecheck error
 * isPlainObject(Temporal.Now);        // ⚠️✅ return true, typecheck error
 * ```
 */
export function isPlainObject<
  TValue extends BasePlainObject = DefaultBasePlainObject,
  TInput = unknown,
>(
  // The predicate type is kept in the union to stay assignable to the parameter
  v:
    | TInput
    | NoInfer<
        TValue extends DefaultBasePlainObject
          ? BasePlainObject
          : PlainObject<TValue>
      >,
  ...staticBuiltInCheck: StaticBuiltInNamespaceCheck<TInput>
): v is TValue extends DefaultBasePlainObject
  ? BasePlainObject
  : PlainObject<TValue>;
export function isPlainObject(v: unknown): boolean {
  if (v === null || typeof v !== "object") {
    return false;
  }

  const proto = Object.getPrototypeOf(v) as typeof Object.prototype | null;
  return (
    proto === null ||
    proto === Object.prototype ||
    // Required to support node:vm.runInNewContext({})
    Object.getPrototypeOf(proto) === null
  );
}
