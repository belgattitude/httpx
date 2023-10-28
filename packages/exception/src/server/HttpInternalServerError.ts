import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 500 Internal Server Error (server)
 *
 * The server has encountered a situation it does not know how to handle.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 * @see https://httpstatus.in/500/
 */
export class HttpInternalServerError extends HttpServerException {
  static readonly STATUS = 500;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpInternalServerError, msgOrParams));
    initProtoAndName(this, HttpInternalServerError);
  }
}
