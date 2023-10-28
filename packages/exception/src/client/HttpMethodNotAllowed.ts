import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 405 Method not allowed (client)
 *
 * The request method is known by the server but is not supported by the target resource.
 * For example, an API may not allow calling DELETE to remove a resource.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
 * @see https://httpstatus.in/405/
 */
export class HttpMethodNotAllowed extends HttpClientException {
  static readonly STATUS = 405;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpMethodNotAllowed, msgOrParams));
    initProtoAndName(this, HttpMethodNotAllowed);
  }
}
