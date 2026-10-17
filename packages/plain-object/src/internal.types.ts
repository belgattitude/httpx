export type PlainObjectKey = string | number | symbol;

export type BasePlainObject = Record<PlainObjectKey, unknown>;

export interface DefaultBasePlainObject extends BasePlainObject {
  readonly __tag: "default-plain-object";
}

export type Simplify<T> = {
  [P in keyof T]: T[P];
} & NonNullable<unknown>;

export type PlainObjectDeepPartialUnknown<T> = {
  [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject
    ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>>
    : unknown;
};

type PropOf<TObj, TKey extends PropertyKey> =
  TObj extends Record<TKey, infer TProp> ? TProp : never;

// Resolved through globalThis so globals missing from the consumer libs
// (ie: Temporal, WebAssembly) resolve to never instead of failing.
type GlobalOf<TKey extends PropertyKey> = PropOf<typeof globalThis, TKey>;

/**
 * Static built-in namespace objects that pass the plain object runtime check.
 */
export type StaticBuiltInNamespace =
  | GlobalOf<"Math">
  | GlobalOf<"JSON">
  | GlobalOf<"Atomics">
  | GlobalOf<"Reflect">
  | GlobalOf<"Intl">
  | GlobalOf<"WebAssembly">
  | GlobalOf<"Temporal">
  | PropOf<GlobalOf<"Temporal">, "Now">;

/**
 * Rest parameter that requires an impossible argument when TInput is
 * statically known to be a static built-in namespace (Math, JSON, Intl...).
 */
export type StaticBuiltInNamespaceCheck<TInput> = 0 extends 1 & TInput
  ? []
  : [TInput] extends [never]
    ? []
    : [TInput] extends [StaticBuiltInNamespace]
      ? [error_static_built_in_namespaces_are_not_plain_objects: never]
      : [];

export type MsgOrErrorFactory = string | (() => Error);
