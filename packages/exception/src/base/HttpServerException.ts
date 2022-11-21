import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';
import { HttpException } from './HttpException';

/**
 * Construct a new HttpServerException class
 *
 * @param statusCode http status code between 500-599, no checks are done on the validity of the number.
 * @param msgOrParams either a message or an object containing HttpExceptionParams
 */
export class HttpServerException extends HttpException {
  constructor(statusCode: number, msgOrParams?: HttpExceptionParams | string) {
    super(statusCode, getSuper('HttpServerException', msgOrParams));
    Object.setPrototypeOf(this, HttpServerException.prototype);
    this.name = 'HttpServerException';
  }
}
