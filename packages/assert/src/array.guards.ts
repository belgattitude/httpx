import type { ArrayNotEmpty } from './array.types';

export const isArrayNotEmpty = <T = unknown>(
  v: unknown
): v is ArrayNotEmpty<T> => {
  return Array.isArray(v) && v.length > 0;
};
