import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 413 Payload too large (client)
 *
 * Request entity is larger than limits defined by server. The server might close the connection or return an Retry-After header field.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
 * @see https://httpstatus.in/413/
 */
export class HttpPayloadTooLarge extends HttpClientException {
  static readonly STATUS = 413;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpPayloadTooLarge, msgOrParams));
    initProtoAndName(this, HttpPayloadTooLarge);
  }
}
