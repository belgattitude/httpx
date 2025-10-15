/**
 * @deprecated
 */
export type StaticBuiltInClass = Math | JSON | Atomics;

/**
 * @deprecated
 */
export const isStaticBuiltInClass = (v: unknown): v is StaticBuiltInClass => {
  return v === Math || v === JSON || v === Atomics;
};
