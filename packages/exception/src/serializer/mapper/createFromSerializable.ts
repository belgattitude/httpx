import type { HttpException } from '../../base';
import { createHttpException } from '../../factory/createHttpException';
import type { HttpExceptionParamsWithIssues } from '../../types/HttpExceptionParamsWithIssues';
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
  SerializerParams,
} from '../types';

type MaskedUndefinedAsStringTillLibEs5SupportsExactTypes = string;

const createCustomError = (
  serializable: Omit<SerializableError | SerializableNonNativeError, '__type'>,
  params?: SerializerParams
): Error | NativeError => {
  const { includeStack = false } = params ?? {};
  const { cause, message, name, stack } = serializable;
  const cls = nativeErrorMap[name as keyof typeof nativeErrorMap] ?? Error;
  const e: Error | NativeError = cause
    ? new cls(message, {
        cause: createFromSerializable(cause, params),
      })
    : new cls(message);
  if (!includeStack) {
    e.stack =
      undefined as unknown as MaskedUndefinedAsStringTillLibEs5SupportsExactTypes;
  } else if (stack !== undefined) {
    e.stack = stack;
  }
  return e;
};

const createHttpExceptionError = (
  serializable: SerializableHttpException,
  params?: SerializerParams
): Error | HttpException => {
  const { includeStack = false } = params ?? {};
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
  const exceptionParams = {
    cause: cause
      ? createFromSerializable(cause, {
          includeStack,
        })
      : undefined,
    code: code,
    errorId: errorId,
    message: message,
    method: method,
    url: url,
    ...(issues ? { issues } : {}),
  } satisfies HttpExceptionParamsWithIssues;
  let e: HttpException;
  try {
    e = isBaseHttpException(name)
      ? new baseExceptionMap[name](statusCode, exceptionParams)
      : createHttpException(statusCode, exceptionParams);
  } catch {
    return createCustomError(
      {
        ...(cause ? { cause } : {}),
        message: exceptionParams.message,
        name,
        ...(includeStack ? { stack } : {}),
      },
      {
        includeStack,
      }
    );
  }
  if (!includeStack) {
    e.stack =
      undefined as unknown as MaskedUndefinedAsStringTillLibEs5SupportsExactTypes;
  } else if (stack !== undefined) {
    e.stack = stack;
  }
  return e;
};

/**
 * create an Error, NativeError or any HttpException from a
 * serializable representation
 *
 * @see {convertToSerializable}
 */
export const createFromSerializable = (
  payload: Serializable,
  params?: SerializerParams
): Error | HttpException | NativeError => {
  let e: Error | HttpException | NativeError;
  switch (payload.__type) {
    case 'HttpException': {
      e = createHttpExceptionError(payload, params);
      break;
    }
    case 'NativeError':
    case 'NonNativeError': {
      e = createCustomError(payload, params);
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
