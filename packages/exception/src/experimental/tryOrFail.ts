import { HttpException } from "../base/HttpException";
import { createHttpException } from "../factory/createHttpException";
import { HttpInternalServerError } from "../server/HttpInternalServerError";
import { isErrorWithErrorStatusCode } from "../typeguards/isErrorWithErrorStatusCode";
import { isObjectWithErrorStatusCode } from "../typeguards/isObjectWithErrorStatusCode";

type AsyncFn<A extends unknown[], O> = (...args: A) => Promise<O>;

export const tryOrFail = async <T extends AsyncFn<unknown[], unknown>>(
  fn: T
): Promise<ReturnType<T>> => {
  // called outside the try block: a synchronous throw is not converted
  const promise = fn();
  try {
    return (await promise) as Awaited<ReturnType<T>>;
  } catch (error: unknown) {
    if (error instanceof HttpException) {
      throw error;
    }
    const { statusCode, cause } = {
      statusCode: isObjectWithErrorStatusCode(error)
        ? error.statusCode
        : HttpInternalServerError.STATUS,
      ...(isErrorWithErrorStatusCode(error)
        ? {
            cause: error,
          }
        : {}),
    };
    throw createHttpException(statusCode, {
      message:
        error instanceof Error && error.message !== ""
          ? error.message
          : undefined,
      cause,
    });
  }
};
