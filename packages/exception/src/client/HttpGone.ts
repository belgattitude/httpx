import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper } from '../utils';

/**
 * 410 Gone (client)
 *
 * This response is sent when the requested content has been permanently deleted from server, with no forwarding address.
 * Clients are expected to remove their caches and links to the resource. The HTTP specification intends
 * this status code to be used for "limited-time, promotional services".
 *
 * APIs should not feel compelled to indicate resources that have been deleted with this status code.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410
 * @see https://httpstatus.in/410/
 */
export class HttpGone extends HttpClientException {
  static readonly STATUS = 410;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'Gone';
    super(410, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpGone.prototype);
    this.name = `Http${name}`;
  }
}
