import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * 511 Network Authentication Required (server)
 *
 * Indicates that the client needs to authenticate to gain network access.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511
 * @see https://httpstatus.in/511/
 */

const status = 511;
const name = 'NetworkAuthenticationRequired';
export class HttpNetworkAuthenticationRequired extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpNetworkAuthenticationRequired);
  }
}
