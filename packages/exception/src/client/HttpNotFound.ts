import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 404 - Not found (client)
 *
 * The server can not find the requested resource. In the browser, this means the URL is not recognized.
 * In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
 * Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an
 * unauthorized client.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 * @see https://httpstatus.in/404/
 */
const status = 404;
const name = 'NotFound';
export class HttpNotFound extends HttpClientException {
  static readonly STATUS = status;
  // static override readonly name = 'HttpNotFound';
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpNotFound);
  }
}
