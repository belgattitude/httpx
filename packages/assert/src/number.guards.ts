import type { ArrayNoNEmpty } from './array.types';

export const isNumberSafeInt = <T = unknown>(
  v: unknown
): v is ArrayNoNEmpty<T> => {
  return typeof v === 'number' && Number.isSafeInteger(v);
};
