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
): NativeError | Error => {
  const { name, message, stack, cause } = serializable;
  const cls = nativeErrorMap[name as keyof typeof nativeErrorMap] ?? Error;
  let e: NativeError | Error;
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
): HttpException | Error => {
  const { statusCode, name, cause, stack } = serializable;
  const params = {
    message: serializable.message,
    url: serializable.url,
    method: serializable.method,
    errorId: serializable.errorId,
    code: serializable.code,
    cause: cause ? createFromSerializable(cause) : undefined,
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
    return createCustomError({ name, message: params.message, stack, cause });
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
): HttpException | NativeError | Error => {
  let e: HttpException | NativeError | Error;
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
