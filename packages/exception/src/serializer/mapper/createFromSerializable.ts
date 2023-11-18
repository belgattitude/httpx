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
  const e: Error | NativeError = cause
    ? new cls(message, {
        cause: createFromSerializable(cause),
      })
    : new cls(message);
  if (stack) {
    e.stack = stack;
  }
  return e;
};

const createHttpExceptionError = (
  serializable: SerializableHttpException
): Error | HttpException => {
  const {
    cause,
    name,
    stack,
    statusCode,
    code,
    errorId,
    message,
    method,
    url,
    issues,
  } = serializable;
  const params = {
    cause: cause ? createFromSerializable(cause) : undefined,
    code: code,
    errorId: errorId,
    message: message,
    method: method,
    url: url,
    ...(issues ? { issues } : {}),
  };
  let e: HttpException;
  try {
    e = isBaseHttpException(name)
      ? new baseExceptionMap[name](statusCode, params)
      : createHttpException(statusCode, params);
  } catch {
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
    case 'HttpException': {
      e = createHttpExceptionError(payload);
      break;
    }
    case 'NativeError':
    case 'NonNativeError': {
      e = createCustomError(payload);
      break;
    }
    default: {
      throw new Error(
        `Can't unserialize from unknown error (${
          (payload as Serializable).name
        })`
      );
    }
  }
  return e;
};
