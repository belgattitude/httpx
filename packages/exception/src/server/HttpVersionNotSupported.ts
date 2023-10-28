import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 505 HTTP Version Not Supported
 *
 * The HTTP version used in the request is not supported by the server.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505
 * @see https://httpstatus.in/505/
 */
export class HttpVersionNotSupported extends HttpServerException {
  static readonly STATUS = 505;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpVersionNotSupported, msgOrParams));
    initProtoAndName(this, HttpVersionNotSupported);
  }
}
