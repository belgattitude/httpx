import type { HttpException } from '../../base';
import { HttpUnprocessableEntity } from '../../client/HttpUnprocessableEntity';
import { isHttpException } from '../../typeguards/isHttpException';
import { isNativeError } from '../typeguard';
import type { NativeError, Serializable, SerializerParams } from '../types';

/**
 * Convert an Error, NativeError or any HttpException to
 * an object suitable for serialization (a serializable version).
 *
 * @see {createFromSerializable}
 */
export const convertToSerializable = (
  e: Error | HttpException | NativeError,
  params?: SerializerParams
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Serializable => {
  const { includeStack = false } = params ?? {};
  const {
    cause: c = null,
    message,
    name,
    stack = null,
  } = (
    (e as unknown) instanceof Error
      ? e
      : {
          message:
            typeof (e as unknown) === 'string'
              ? e
              : `Can't serialize error at runtime. Received '${typeof e}'`,
          name: 'Error',
        }
  ) as Error;
  const cause = c instanceof Error ? convertToSerializable(c) : null;
  const common = {
    message,
    name,
    ...(includeStack && stack ? { stack } : {}),
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
