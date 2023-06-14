import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper } from '../utils';

/**
 * 414 URI too long (client)
 *
 * The URI requested by the client is longer than the server is willing to interpret.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
 * @see https://httpstatus.in/414/
 */
export class HttpUriTooLong extends HttpClientException {
  static readonly STATUS = 414;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'UriTooLong';
    super(414, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpUriTooLong.prototype);
    this.name = `Http${name}`;
  }
}
