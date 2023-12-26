import type { HttpErrorStatusCodeOrNumber } from '../types';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper, initProtoAndName } from '../utils';
import { HttpException } from './HttpException';

/**
 * Construct a new HttpClientException class
 *
 * @param statusCode http status code between 400-499, no checks are done on the validity of the number.
 * @param msgOrParams either a message or an object containing HttpExceptionParams
 */
export class HttpClientException extends HttpException {
  constructor(
    statusCode: HttpErrorStatusCodeOrNumber,
    msgOrParams?: HttpExceptionParams | string
  ) {
    super(statusCode, getSuper(HttpClientException, msgOrParams));
    initProtoAndName(this, HttpClientException);
  }
}
