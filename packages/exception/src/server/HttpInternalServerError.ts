import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 500 Internal Server Error (server)
 *
 * The server has encountered a situation it does not know how to handle.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 * @see https://httpstatus.in/500/
 */

const status = 500;
const name = 'InternalServerError';
export class HttpInternalServerError extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpInternalServerError);
  }
}
