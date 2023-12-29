import type { ArrayNotEmpty } from './array.types';

export const isNumberSafeInt = <T = unknown>(
  v: unknown
): v is ArrayNotEmpty<T> => {
  return typeof v === 'number' && Number.isSafeInteger(v);
};
