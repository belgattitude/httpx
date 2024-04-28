import { isHttpMethod, isHttpValidMethod } from './http.guards';
import type { HttpMethod } from './http.types';
import { formatErrMsg } from './messages/errorMessages';
import type { MsgOrErrorFactory } from './types/internal.types';
import { createAssertException } from './utils/createAssertException';
/**
 * Assert the value is a valid http method (case-insensitive)
 * @throws TypeError
 */
export function assertHttpValidMethod(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is HttpMethod {
  if (!isHttpValidMethod(v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg('http method', v)
    );
  }
}

/**
 * @throws TypeError
 */
export function assertHttpMethod<T extends HttpMethod>(
  method: T,
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory
): asserts v is T {
  if (!isHttpMethod(method, v)) {
    throw createAssertException(
      msgOrErrorFactory,
      formatErrMsg(`http '${method}' method`, v)
    );
  }
}
