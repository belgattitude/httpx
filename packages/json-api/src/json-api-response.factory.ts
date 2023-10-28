import type {
  JsonApiError,
  JsonApiErrorResponse,
  JsonApiSuccessResponse,
} from './json-api-response.types';
import { isPlainObject } from './typeguards';

export class JsonApiResponseFactory {
  static fromError = (
    errors: JsonApiError | JsonApiError[] | string,
    /** fallback http status if not present in JsonApiError */
    httpStatus?: number
  ): JsonApiErrorResponse => {
    let errs: JsonApiError[];
    if (typeof errors === 'string') {
      errs = [{ title: errors, ...(httpStatus ? { status: httpStatus } : {}) }];
    } else if (isPlainObject(errors)) {
      errs = [errors];
    } else {
      errs = errors;
    }
    return {
      errors: errs,
      success: false,
    };
  };
  static fromSuccess = <T>(
    data: T,
    metadata?: JsonApiSuccessResponse<T>['meta']
  ): JsonApiSuccessResponse<T> => {
    return {
      data: data,
      success: true,
      ...(isPlainObject(metadata) ? { meta: metadata } : {}),
    };
  };
}
