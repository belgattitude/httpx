import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 413 Payload too large (client)
 *
 * Request entity is larger than limits defined by server. The server might close the connection or return an Retry-After header field.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
 * @see https://httpstatus.in/413/
 */
const status = 413;
const name = 'PayloadTooLarge';
export class HttpPayloadTooLarge extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpPayloadTooLarge);
  }
}
