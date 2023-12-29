import { errorMessages } from './messages/errorMessages';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
import { isUuid, isUuidV1, isUuidV3, isUuidV4, isUuidV5 } from './uuid.guards';
import type {
  Uuid,
  UuidV1,
  UuidV3,
  UuidV4,
  UuidV5,
  UuidVersion,
} from './uuid.types';

export function assertUuid(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory | undefined,
  version?: UuidVersion | undefined
): asserts v is Uuid {
  if (!isUuid(v, version)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.uuid(version));
  }
}

export function assertUuidV1(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory | undefined
): asserts v is UuidV1 {
  if (!isUuidV1(v)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.uuid(1));
  }
}

export function assertUuidV3(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory | undefined
): asserts v is UuidV3 {
  if (!isUuidV3(v)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.uuid(3));
  }
}

export function assertUuidV4(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory | undefined
): asserts v is UuidV4 {
  if (!isUuidV4(v)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.uuid(4));
  }
}

export function assertUuidV5(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory | undefined
): asserts v is UuidV5 {
  if (!isUuidV5(v)) {
    throw createAssertException(msgOrErrorFactory, errorMessages.uuid(5));
  }
}
