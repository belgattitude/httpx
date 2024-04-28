import { formatErrMsg } from './messages/errorMessages';
import { isNetworkPort } from './network.guards';
import type { NetworkPort } from './network.types';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
/**
 * @throws TypeError
 */
export function assertNetworkPort(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is NetworkPort {
  if (!isNetworkPort(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('network port', v)
    );
  }
}
