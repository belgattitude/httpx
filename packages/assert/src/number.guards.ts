import type { ArrayNonEmpty } from './array.types';

export const isNumberSafeInt = <T = unknown>(
  v: unknown
): v is ArrayNonEmpty<T> => {
  return typeof v === 'number' && Number.isSafeInteger(v);
};
