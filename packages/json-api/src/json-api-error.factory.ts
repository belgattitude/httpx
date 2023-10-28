import { type HttpException, isHttpException } from '@httpx/exception';
import type { JsonApiError } from './json-api-response.types';

export class JsonApiErrorFactory {
  static fromCatchVariable = (
    error: unknown,
    defaultHttpStatus = 500
  ): JsonApiError => {
    const e =
      typeof error === 'string' || error instanceof Error
        ? error
        : `Unknown error (type of catched variable: ${typeof error}`;
    return JsonApiErrorFactory.fromHttpException(e, defaultHttpStatus);
  };

  static fromHttpException = (
    exception: Error | HttpException | string,
    /** fallback http status if it can't be inferred from exception */
    defaultHttpStatus = 500
  ): JsonApiError => {
    if (typeof exception === 'string') {
      return {
        status: defaultHttpStatus,
        title: exception,
      };
    }
    if (isHttpException(exception)) {
      return {
        status: exception.statusCode,
        title: exception.message,
      };
    }
    const { message, status, statusCode } = {
      ...{ status: null, statusCode: null },
      ...exception,
    };
    return {
      status: status ?? statusCode ?? defaultHttpStatus,
      title: message,
    };
  };
}
