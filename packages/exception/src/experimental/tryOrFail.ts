import { HttpException } from '../base';
import { createHttpException } from '../factory';
import { isHttpErrorStatusCode } from '../typeguards';
import type { HttpExceptionParams, HttpStatusCode } from '../types';

type AsyncFn<A extends unknown[], O> = (...args: A) => Promise<O>;

export const runOrThrowHttpException = async <
  T extends AsyncFn<unknown[], unknown>,
>(
  exception:
    | HttpException
    | HttpStatusCode
    | HttpExceptionParams
    | [HttpStatusCode, HttpExceptionParams],
  fn: T
): Promise<ReturnType<T>> => {
  try {
    return (await fn()) as Awaited<ReturnType<T>>;
  } catch (e) {
    if (e instanceof HttpException) {
      throw e;
    }
    if (
      e instanceof Error &&
      'statusCode' in e &&
      isHttpErrorStatusCode(e.statusCode)
    ) {
      throw createHttpException(e.statusCode, {
        message: e.message,
        cause: e,
      });
    }
  }
  throw createHttpException(500);
};

export const tryOrFail2 = async <T extends AsyncFn<unknown[], unknown>>(
  fn: T,
  onFailure?:
    | HttpException
    | HttpStatusCode
    | HttpExceptionParams
    | [HttpStatusCode, HttpExceptionParams],
  onResponse?: (response: Awaited<ReturnType<T>>) => void
): Promise<ReturnType<T>> => {
  try {
    const response = (await fn()) as Awaited<ReturnType<T>>;
    if (onResponse) {
      onResponse(response);
    }
    return response;
  } catch (e) {
    if (e instanceof HttpException) {
      throw e;
    }
    if (
      e instanceof Error &&
      'statusCode' in e &&
      isHttpErrorStatusCode(e.statusCode)
    ) {
      throw createHttpException(e.statusCode, {
        message: e.message,
        cause: e,
      });
    }
  }
  throw createHttpException(500);
};

export const tryOrFail = async <T extends AsyncFn<unknown[], unknown>>(
  fn: T,
  onFailure?:
    | HttpException
    | HttpStatusCode
    | HttpExceptionParams
    | [HttpStatusCode, HttpExceptionParams]
): Promise<ReturnType<T>> => {
  return fn().catch((e) => {
    if (e instanceof HttpException) {
      throw e;
    }
    if (
      e instanceof Error &&
      'statusCode' in e &&
      isHttpErrorStatusCode(e.statusCode)
    ) {
      throw createHttpException(e.statusCode, {
        message: e.message,
        cause: e,
      });
    }
    throw createHttpException(500);
  }) as Awaited<ReturnType<T>>;
};
