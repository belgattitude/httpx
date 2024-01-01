import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 502 Bad Gateway (server)
 *
 * This error response means that the server, while working as a gateway to get a response needed to
 * handle the request, got an invalid response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
 */
export class HttpBadGateway extends HttpServerException {
  static readonly STATUS = 502;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpBadGateway, msgOrParams));
    initProtoAndName(this, HttpBadGateway);
  }
}
