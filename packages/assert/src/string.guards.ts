import { isNumberSafeInt } from './number.guards';
import type {
  StrParsableSafeInt,
  StrParsableStrictIsoDateZ,
} from './string.types';
import { isoDateTimeZRegexp } from './string.utils';

export const isStrNotEmpty = (v: unknown): v is string => {
  return typeof v === 'string' && v.trim().length > 0;
};

const alphaRegexp = /^-?\d+$/;
export const isStrParsableSafeInt = (v: unknown): v is StrParsableSafeInt => {
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
 * isStrParsableIsoDateZ('2023-12-29T23:37:31.653z')
 * ```
 *
 * @link https://en.wikipedia.org/wiki/ISO_8601
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 * @link https://en.wikipedia.org/wiki/Coordinated_Universal_Time
 */
export const isStrParsableStrictIsoDateZ = (
  v: unknown
): v is StrParsableStrictIsoDateZ => {
  if (
    !isStrNotEmpty(v) ||
    v.length !== 24 ||
    !isoDateTimeZRegexp.test(v.toLocaleUpperCase())
  ) {
    return false;
  }
  try {
    const d = new Date(v);
    return d.toISOString().toLocaleLowerCase() === v.toLocaleLowerCase();
  } catch {
    return false;
  }
};
