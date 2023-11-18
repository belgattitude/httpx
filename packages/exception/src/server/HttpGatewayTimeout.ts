import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 504 Gateway Timeout (server)
 *
 * This error response is given when the server is acting as a gateway and cannot get a response in time.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
 * @see https://httpstatus.in/504/
 */
export class HttpGatewayTimeout extends HttpServerException {
  static readonly STATUS = 504;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpGatewayTimeout, msgOrParams));
    initProtoAndName(this, HttpGatewayTimeout);
  }
}
