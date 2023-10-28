export const isPlainObject = <T = unknown, K extends number | string = string>(
  v: unknown
): v is Record<K, T> => {
  return (
    typeof v === 'object' &&
    v !== null &&
    v.constructor === Object &&
    Object.getPrototypeOf(v) === Object.prototype
  );
};
