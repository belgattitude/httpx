import { HttpClientException } from '../base/HttpClientException';
import { HttpException } from '../base/HttpException';
import { HttpServerException } from '../base/HttpServerException';
import { statusMap } from '../status';
import { isHttpErrorStatusCode } from '../typeguards/isHttpErrorStatusCode';
import type { AssignedErrorStatusCodes } from '../types/AssignedErrorStatusCodes';
import type {
  HttpExceptionFromStatus,
  HttpExceptionParamsFromStatus,
} from '../types/FromStatusCode';
import type { HttpErrorStatusCodeOrNumber } from '../types/HttpErrorStatusCodeOrNumber';

/**
 * Create a concrete http exception object from a given http status code.
 *
 * If the status does not have an assigned ietf class, it will default
 * to either HttpClientException or HttpServerException based on ranges
 * (client: 400-499, server: 500-599).
 *
 * At last resort, if the provided status does not meet error range requirements
 * (400-599), it will create an HttpException with the out-of-scope code (ie: 100, 300, 1099...)
 *
 * @param statusCode http status code between 400-599
 * @param msgOrParams either a message or an object containing HttpExceptionParams
 */

export const createHttpException = <T extends HttpErrorStatusCodeOrNumber>(
  statusCode: T,
  msgOrParams?: HttpExceptionParamsFromStatus<T> | string | undefined
): HttpExceptionFromStatus<T> => {
  if (isHttpErrorStatusCode<AssignedErrorStatusCodes>(statusCode)) {
    const cls = statusMap?.[statusCode];
    if (cls) {
      return new cls(msgOrParams) as HttpExceptionFromStatus<T>;
    }
    return (
      statusCode < 500
        ? new HttpClientException(statusCode, msgOrParams)
        : new HttpServerException(statusCode, msgOrParams)
    ) as HttpExceptionFromStatus<typeof statusCode>;
  }
  return new HttpException(statusCode, msgOrParams) as HttpExceptionFromStatus<
    typeof statusCode
  >;
};
