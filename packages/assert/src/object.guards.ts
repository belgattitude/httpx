import type { PlainObject } from './object.types';

export const isPlainObject = <
  TValue extends Record<string, unknown> = Record<string, unknown>,
>(
  v: unknown
): v is PlainObject<TValue> => {
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
