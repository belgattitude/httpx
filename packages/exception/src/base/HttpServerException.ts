import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper, initProtoAndName } from '../utils';
import { HttpException } from './HttpException';

/**
 * Construct a new HttpServerException class
 *
 * @param statusCode http status code between 500-599, no checks are done on the validity of the number.
 * @param msgOrParams either a message or an object containing HttpExceptionParams
 */
export class HttpServerException extends HttpException {
  constructor(statusCode: number, msgOrParams?: HttpExceptionParams | string) {
    super(statusCode, getSuper(HttpServerException.name, msgOrParams));
    initProtoAndName(this, HttpServerException);
  }
}