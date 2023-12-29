import { isNumberSafeInt } from './number.guards';
import type { StrParsableSafeInt } from './string.types';

export const isStrNotEmpty = (
  v: unknown,
  options?: { trim: boolean }
): v is string => {
  const { trim = true } = options ?? {};
  return typeof v === 'string' && (trim ? v.trim() : v).length > 0;
};

const alphaRegexp = /^-?\d+$/;
export const isStrParsableSafeInt = (v: unknown): v is StrParsableSafeInt => {
  if (typeof v !== 'string') {
    return false;
  }
  const value = alphaRegexp.test(v) ? Number.parseInt(v, 10) : v;
  return isNumberSafeInt(value);
};
