import { formatErrMsg } from './messages/errorMessages';
import { isStrNotEmpty, isStrParsableSafeInt } from './string.guards';
import type {
  StrParsableSafeInt,
  StrParsableStrictIsoDateZ,
} from './string.types';
import { isoDateTimeZRegexp } from './string.utils';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * Assert string is not empty (trims the string by default)
 * @throws TypeError
 */
export function assertStrNotEmpty(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is string {
  if (!isStrNotEmpty(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(`non-empty string`, v)
    );
  }
}

export function assertStrParsableSafeInt(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is StrParsableSafeInt {
  if (!isStrParsableSafeInt(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(`string containing a safe integer`, v)
    );
  }
}

/**
 * @throws TypeError
 */
export function assertStrParsableStrictIsoDateZ(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is StrParsableStrictIsoDateZ {
  let check: 'INVALID_FORMAT' | 'INVALID_DATE' | true | null = null;
  if (typeof v !== 'string') {
    check = null;
  } else if (
    v.length === 24 &&
    isoDateTimeZRegexp.test(v.toLocaleUpperCase())
  ) {
    try {
      const d = new Date(v);
      check =
        d.toISOString().toLocaleLowerCase() === v.toLocaleLowerCase()
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
