import { HttpException } from '../base/HttpException';
import { createHttpException } from '../factory/createHttpException';
import { HttpInternalServerError } from '../server/HttpInternalServerError';
import { isErrorWithErrorStatusCode } from '../typeguards/isErrorWithErrorStatusCode';
import { isObjectWithErrorStatusCode } from '../typeguards/isObjectWithErrorStatusCode';

type AsyncFn<A extends unknown[], O> = (...args: A) => Promise<O>;

export const tryOrFail = async <T extends AsyncFn<unknown[], unknown>>(
  fn: T
): Promise<ReturnType<T>> => {
  return fn().catch((e) => {
    if (e instanceof HttpException) {
      throw e;
    }
    const { statusCode, cause } = {
      statusCode: isObjectWithErrorStatusCode(e)
        ? e.statusCode
        : HttpInternalServerError.STATUS,
      ...(isErrorWithErrorStatusCode(e)
        ? {
            cause: e,
          }
        : {}),
    };
    throw createHttpException(statusCode, {
      message: e instanceof Error && e.message !== '' ? e.message : undefined,
      cause,
    });
  }) as Awaited<ReturnType<T>>;
};
