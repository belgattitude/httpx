import type { HttpException } from '../../base';
import { createHttpException } from '../../factory';
import {
  baseExceptionMap,
  isBaseHttpException,
  nativeErrorMap,
} from '../typeguard';
import type {
  NativeError,
  Serializable,
  SerializableError,
  SerializableHttpException,
  SerializableNonNativeError,
} from '../types';

const createCustomError = (
  serializable: Omit<SerializableError | SerializableNonNativeError, '__type'>
): Error | NativeError => {
  const { cause, message, name, stack } = serializable;
  const cls = nativeErrorMap[name as keyof typeof nativeErrorMap] ?? Error;
  let e: Error | NativeError;
  if (cause) {
    e = new cls(message, {
      cause: createFromSerializable(cause),
    });
  } else {
    e = new cls(message);
  }
  if (stack) {
    e.stack = stack;
  }
  return e;
};

const createHttpExceptionError = (
  serializable: SerializableHttpException
): Error | HttpException => {
  const { cause, name, stack, statusCode } = serializable;
  const params = {
    cause: cause ? createFromSerializable(cause) : undefined,
    code: serializable.code,
    errorId: serializable.errorId,
    message: serializable.message,
    method: serializable.method,
    url: serializable.url,
    ...(serializable.issues ? { issues: serializable.issues } : {}),
  };
  let e: HttpException;
  try {
    if (isBaseHttpException(name)) {
      e = new baseExceptionMap[name](statusCode, params);
    } else {
      e = createHttpException(statusCode, params);
    }
  } catch (e) {
    return createCustomError({ cause, message: params.message, name, stack });
  }
  if (stack) {
    e.stack = stack;
  }
  return e;
};

/**
 * create an Error, NativeError or any HttpException from a
 * serializable representation
 *
 * @link {convertToSerializable}
 */
export const createFromSerializable = (
  payload: Serializable
): Error | HttpException | NativeError => {
  let e: Error | HttpException | NativeError;
  switch (payload.__type) {
    case 'HttpException':
      e = createHttpExceptionError(payload);
      break;
    case 'NativeError':
    case 'NonNativeError':
      e = createCustomError(payload);
      break;
    default:
      throw new Error(
        `Can't unserialize from unknown error (${
          (payload as Serializable).name
        })`
      );
  }
  return e;
};
