import { isNumberSafeInt } from './number.guards';
import type {
  ParsableSafeInt,
  ParsableStrictIsoDateZ,
  StringNonEmpty,
} from './string.types';
import { isoDateTimeZRegexp } from './string.utils';

export const isStringNonEmpty = (v: unknown): v is StringNonEmpty => {
  return typeof v === 'string' && v.trim().length > 0;
};

const alphaRegexp = /^-?\d+$/;
export const isParsableSafeInt = (v: unknown): v is ParsableSafeInt => {
  if (typeof v !== 'string') {
    return false;
  }
  const value = alphaRegexp.test(v) ? Number.parseInt(v, 10) : v;
  return isNumberSafeInt(value);
};

/**
 * Checks if the value is a string containing a valid ISO-8601 date time
 * with microseconds that ends with 'z' representing UTC+0 timezone (aka zulu time).
 * Format is 'YYYY-MM-DDTHH:mm:ss.sssZ'. Datetime is checked for validity.
 *
 * ```typescript
 * isParsableStrictIsoDateZ('2023-12-29T23:37:31.653z')
 * ```
 *
 * @link https://en.wikipedia.org/wiki/ISO_8601
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 * @link https://en.wikipedia.org/wiki/Coordinated_Universal_Time
 */
export const isParsableStrictIsoDateZ = (
  v: unknown
): v is ParsableStrictIsoDateZ => {
  if (!isStringNonEmpty(v) || v.length !== 24 || !isoDateTimeZRegexp.test(v)) {
    return false;
  }
  try {
    return new Date(v).toISOString().toUpperCase() === v.toUpperCase();
  } catch {
    return false;
  }
};
