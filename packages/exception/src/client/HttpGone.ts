import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

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
const status = 410;
const name = 'Gone';
export class HttpGone extends HttpClientException {
  static readonly STATUS = status;
  // static override readonly name = 'HttpNotFound';
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpGone);
  }
}
