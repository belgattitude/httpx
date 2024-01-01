import type { ArrayNoNEmpty } from './array.types';

export const isArrayNonEmpty = <T = unknown>(
  v: unknown
): v is ArrayNoNEmpty<T> => {
  return Array.isArray(v) && v.length > 0;
};
