export const isPlainObject = <T = unknown, K extends number | string = string>(
  v: unknown
): v is Record<K, T> => {
  return (
    typeof v === 'object' &&
    v !== null &&
    (Object.getPrototypeOf(v) as typeof Object.prototype).constructor ===
      Object.prototype.constructor
  );
};
