import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 431 Request Header Fields Too Large (client)
 *
 * The server is unwilling to process the request because its header fields are too large.
 * The request may be resubmitted after reducing the size of the request header fields.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431
 * @see https://httpstatus.in/431/
 */
const status = 431;
const name = 'RequestHeaderFieldsTooLarge';
export class HttpRequestHeaderFieldsTooLarge extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpRequestHeaderFieldsTooLarge);
  }
}
