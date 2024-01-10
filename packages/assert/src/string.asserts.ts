import { formatErrMsg } from './messages/errorMessages';
import { isParsableSafeInt, isStringNonEmpty } from './string.guards';
import type { ParsableSafeInt, ParsableStrictIsoDateZ } from './string.types';
import { isoDateTimeZRegexp } from './string.utils';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * Assert string is not empty (trims the string by default)
 * @throws TypeError
 */
export function assertStringNonEmpty(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is string {
  if (!isStringNonEmpty(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(`non-empty string`, v)
    );
  }
}

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
 * @throws TypeError
 */
export function assertParsableStrictIsoDateZ(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is ParsableStrictIsoDateZ {
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
