import type { NumberSafeInt } from './number.types';

export const isNumberSafeInt = (v: unknown): v is NumberSafeInt => {
  return typeof v === 'number' && Number.isSafeInteger(v);
};
