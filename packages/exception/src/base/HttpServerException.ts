import type { HttpErrorStatusCodeOrNumber } from '../types';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';
import { HttpException } from './HttpException';

/**
 * Construct a new HttpServerException class
 *
 * @param statusCode http status code between 500-599, no checks are done on the validity of the number.
 * @param msgOrParams either a message or an object containing HttpExceptionParams
 */
export class HttpServerException extends HttpException {
  constructor(
    statusCode: HttpErrorStatusCodeOrNumber,
    msgOrParams?: HttpExceptionParams | string
  ) {
    const name = 'ServerException';
    super(statusCode, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpServerException);
  }
}
