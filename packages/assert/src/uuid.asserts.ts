import { formatErrMsg } from './messages/errorMessages';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
import { isUuid } from './uuid.guards';
import type {
  Uuid,
  UuidV1,
  UuidV3,
  UuidV4,
  UuidV5,
  UuidVersion,
} from './uuid.types';

const errMsg = (version?: UuidVersion) =>
  [`uuid`, version === undefined ? undefined : `v${version}`]
    .filter(Boolean)
    .join(' ');

/**
 * Asserts a value is a valid uuid v1, v3, v4 or v5
 * Accept optional version
 * @throws TypeError
 */
export function assertUuid(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  options?: {
    version?: UuidVersion;
  }
): asserts v is Uuid {
  const { version } = options ?? {};
  if (!isUuid(v, version)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(errMsg(version), v)
    );
  }
}

/**
 * Asserts a value is a valid uuid v1
 * @throws TypeError
 */
export function assertUuidV1(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is UuidV1 {
  assertUuid(v, msgOrErrorFactory, {
    version: 1,
  });
}

/**
 * Asserts a value is a valid uuid v3
 * @throws TypeError
 */

export function assertUuidV3(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is UuidV3 {
  assertUuid(v, msgOrErrorFactory, {
    version: 3,
  });
}

/**
 * Assert a value is a valid uuid v4
 * @throws TypeError
 */
export function assertUuidV4(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is UuidV4 {
  assertUuid(v, msgOrErrorFactory, {
    version: 4,
  });
}

/**
 * Assert a value is a valid uuid v5
 * @throws TypeError
 */
export function assertUuidV5(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is UuidV5 {
  assertUuid(v, msgOrErrorFactory, {
    version: 5,
  });
}
