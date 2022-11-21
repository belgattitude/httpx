import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

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
    const name = 'NetworkAuthenticationRequired';
    super(511, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpNetworkAuthenticationRequired.prototype);
    this.name = `Http${name}`;
  }
}
