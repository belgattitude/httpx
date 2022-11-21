import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 431 Request Header Fields Too Large (client)
 *
 * The server is unwilling to process the request because its header fields are too large.
 * The request may be resubmitted after reducing the size of the request header fields.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431
 * @see https://httpstatus.in/431/
 */
export class HttpRequestHeaderFieldsTooLarge extends HttpClientException {
  static readonly STATUS = 431;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'RequestHeaderFieldsTooLarge';
    super(431, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpRequestHeaderFieldsTooLarge.prototype);
    this.name = `Http${name}`;
  }
}
