import type { PlainObject } from './object.types';

export const isPlainObject = <
  TValue extends Record<string, unknown> = Record<string, unknown>,
>(
  v: unknown
): v is PlainObject<TValue> => {
  return (
    typeof v === 'object' &&
    v !== null &&
    (Object.getPrototypeOf(v) as typeof Object.prototype)?.constructor ===
      Object.prototype.constructor
  );
};
