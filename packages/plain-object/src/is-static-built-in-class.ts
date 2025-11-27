export type StaticBuiltInClass = Math | JSON | Atomics;

/**
 * @deprecated create a custom typeguard if you need it
 */
export const isStaticBuiltInClass = (v: unknown): v is StaticBuiltInClass => {
  return v === Math || v === JSON || v === Atomics;
};
