import type { HttpException } from '../../base';
import { HttpUnprocessableEntity } from '../../client';
import { isHttpException } from '../../typeguards';
import { isNativeError } from '../typeguard';
import type { Serializable, NativeError } from '../types';

/**
 * Convert an Error, NativeError or any HttpException to
 * an object suitable for serialization (a serializable version).
 *
 * @link {createFromSerializable}
 */
export const convertToSerializable = (
  e: Error | NativeError | HttpException
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Serializable => {
  const {
    name,
    message,
    stack = null,
    cause: c = null,
  } = (
    (e as unknown) instanceof Error
      ? e
      : {
          name: 'Error',
          message:
            typeof (e as unknown) === 'string'
              ? e
              : `Can't serialize error at runtime. Received '${typeof e}'`,
        }
  ) as Error;
  const cause = c instanceof Error ? convertToSerializable(c) : null;
  const common = {
    name,
    message,
    ...(stack ? { stack } : {}),
    ...(cause ? { cause } : {}),
  };
  if (isHttpException(e)) {
    return {
      __type: 'HttpException',
      ...common,
      statusCode: e.statusCode,
      ...(e.url ? { url: e.url } : {}),
      ...(e.code ? { code: e.code } : {}),
      ...(e.method ? { method: e.method } : {}),
      ...(e.errorId ? { errorId: e.errorId } : {}),
      ...(e instanceof HttpUnprocessableEntity ? { issues: e.issues } : {}),
    };
  }
  return {
    __type: isNativeError(e) ? 'NativeError' : 'NonNativeError',
    ...common,
  };
};
