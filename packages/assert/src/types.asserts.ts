import { formatErrMsg } from './messages/errorMessages';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';

/**
 * @throws TypeError
 */
export function assertNever(
  v: never,
  msgOrErrorFactory?: MsgOrErrorFactory
): never {
  throw createAssertException(
    msgOrErrorFactory,
    formatErrMsg('A value is not expected (assertNever)', v, {
      pfx: false,
    })
  );
}

/**
 * A slight variation of assertNever that doesn't throw in runtime and
 * will return the value. Typechecks are still enforced.
 */
export function assertNeverNoThrow(v: never): never {
  return v;
}
