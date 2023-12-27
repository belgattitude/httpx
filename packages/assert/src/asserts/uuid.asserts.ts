import { isUuidV4 } from '../guards';
import type { UuidV4 } from '../types';
import type { MsgOrErrorFactory } from '../types/internal.types';
import { createAssertException } from '../utils/createAssertException';

export function assertUuidV4(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is UuidV4 {
  if (!isUuidV4(v)) {
    throw createAssertException(msgOrErrorFactory, 'Value is not a uuid v4');
  }
}
