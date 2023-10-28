import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperData, setProto } from '../utils';

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
    super(...getSuperData(HttpForbidden, msgOrParams));
    setProto(this, HttpForbidden);
  }
}
