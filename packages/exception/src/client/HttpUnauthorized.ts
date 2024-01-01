import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 401 Unauthorized (client)
 *
 * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
 * That is, the client must authenticate itself to get the requested response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 * @see https://httpstatus.in/401/
 */
export class HttpUnauthorized extends HttpClientException {
  static readonly STATUS = 401;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpUnauthorized, msgOrParams));
    initProtoAndName(this, HttpUnauthorized);
  }
}
