import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 406 Not acceptable (client)
 *
 * This response is sent when the web server, after performing server-driven content negotiation, doesn't find
 * any content that conforms to the criteria given by the user agent.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
 * @see https://httpstatus.in/406/
 */
export class HttpNotAcceptable extends HttpClientException {
  static readonly STATUS = 406;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'NotAcceptable';
    super(406, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpNotAcceptable.prototype);
    this.name = `Http${name}`;
  }
}
