import { formatErrMsg } from './messages/errorMessages';
import { isParsableSafeInt, isStringNonEmpty } from './string.guards';
import type {
  ParsableSafeInt,
  ParsableStrictIsoDateZ,
  StringNonEmpty,
} from './string.types';
import { isoDateTimeZRegexp } from './string.utils';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * Assert a value is a non-empty string (trims the string by default)
 * @throws TypeError
 */
export function assertStringNonEmpty(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is StringNonEmpty {
  if (!isStringNonEmpty(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(`non-empty string`, v)
    );
  }
}

/**
 *
 * @throws TypeError
 */
export function assertParsableSafeInt(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is ParsableSafeInt {
  if (!isParsableSafeInt(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(`string containing a safe integer`, v)
    );
  }
}

/**
 * Ensure a string that contains an ISO-8601 date time in 'YYYY-MM-DDTHH:mm:ss.sssZ'
 * format (UTC+0 / time). This check allow the value to be safely passed to `new Date()`or `Date.parse()`
 * without parser or timezone mis-interpretations. 'T' and 'Z' checks are done in a case-insensitive way.
 *
 * ```typescript
 * assertParsableStrictIsoDateZ('2023-12-28T23:37:31.653Z'); // ✅ true
 * assertParsableStrictIsoDateZ('2023-12-29T23:37:31.653z'); // ✅ true  (case-insensitive works)
 * assertParsableStrictIsoDateZ('2023-12-28T23:37:31.653');  // 💥 false (missing 'Z')
 * assertParsableStrictIsoDateZ('2023-02-29T23:37:31.653Z'); // 💥 false (No 29th february in 2023)
 *
 * const dateStr = '2023-12-29T23:37:31.653Z';
 * assertParsableStrictIsoDateZ(dateStr, `Wrong date: ${dateStr}`);
 * // 👉 assertion passed, safe to use
 * const date = new Date(dateStr);
 * const timestampNumber = Date.parse(dateStr);
 * ```
 *
 * @throws TypeError
 */
export function assertParsableStrictIsoDateZ(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is ParsableStrictIsoDateZ {
  let check: 'INVALID_FORMAT' | 'INVALID_DATE' | true | null = null;
  if (typeof v !== 'string') {
    check = null;
  } else if (v.length === 24 && isoDateTimeZRegexp.test(v)) {
    try {
      check =
        new Date(v).toISOString().toUpperCase() === v.toUpperCase()
          ? true
          : 'INVALID_DATE';
    } catch {
      check = 'INVALID_DATE';
    }
  } else {
    check = 'INVALID_FORMAT';
  }
  if (check !== true) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(
        `string containing a strict iso date${
          check === null ? '' : ` (${check})`
        }`,
        v
      )
    );
  }
}
