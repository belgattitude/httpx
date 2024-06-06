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
 * Check if a value is a string that contains an ISO-8601 date time in 'YYYY-MM-DDTHH:mm:ss.sssZ'
 * format (UTC+0 / time). This check allow the value to be safely passed to `new Date()`or `Date.parse()`
 * without parser or timezone mis-interpretations. 'T' and 'Z' checks are done in a case-insensitive way.
 *
 * ```typescript
 * isParsableStrictIsoDateZ('2023-12-28T23:37:31.653Z'); // ✅ true
 * isParsableStrictIsoDateZ('2023-12-29T23:37:31.653z'); // ✅ true  (case-insensitive works)
 * isParsableStrictIsoDateZ('2023-12-28T23:37:31.653');  // ❌ false (missing 'Z')
 * isParsableStrictIsoDateZ('2023-02-29T23:37:31.653Z'); // ❌ false (No 29th february in 2023)
 *
 * const dateStr = '2023-12-29T23:37:31.653Z';
 * if (isParsableStrictIsoDateZ(dateStr)) {
 *   const date = new Date(dateStr);
 *   const timestampNumber = Date.parse(dateStr);
 * } else {
 *   // invalid format
 * }
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
