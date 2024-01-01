import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 403 Forbidden (client)
 *
 * The client does not have access rights to the content; that is, it is unauthorized, so the server
 * is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 * @see https://httpstatus.in/403/
 */
export class HttpForbidden extends HttpClientException {
  static readonly STATUS = 403;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpForbidden, msgOrParams));
    initProtoAndName(this, HttpForbidden);
  }
}
