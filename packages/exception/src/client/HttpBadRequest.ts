import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 400 Bad Request (client)
 *
 * The server cannot or will not process the request due to something that is perceived to be a client error
 * (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 *
 * @see https://httpstatus.in/400/
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export class HttpBadRequest extends HttpClientException {
  static readonly STATUS = 400;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'BadRequest';
    super(400, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpBadRequest.prototype);
    this.name = `Http${name}`;
  }
}
