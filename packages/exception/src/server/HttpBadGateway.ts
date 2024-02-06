import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 502 Bad Gateway (server)
 *
 * This error response means that the server, while working as a gateway to get a response needed to
 * handle the request, got an invalid response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
 */
const status = 502;
const name = 'BadGateway';

export class HttpBadGateway extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpBadGateway);
  }
}
