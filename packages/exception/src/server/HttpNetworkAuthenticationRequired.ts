import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperData, setProto } from '../utils';

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
    super(...getSuperData(HttpNetworkAuthenticationRequired, msgOrParams));
    setProto(this, HttpNetworkAuthenticationRequired);
  }
}
