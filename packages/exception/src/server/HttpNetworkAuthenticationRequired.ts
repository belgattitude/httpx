import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 511 Network Authentication Required (server)
 *
 * Indicates that the client needs to authenticate to gain network access.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511
 * @see https://httpstatus.in/511/
 */
export class HttpNetworkAuthenticationRequired extends HttpServerException {
  static readonly STATUS = 511;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpNetworkAuthenticationRequired, msgOrParams));
    initProtoAndName(this, HttpNetworkAuthenticationRequired);
  }
}
