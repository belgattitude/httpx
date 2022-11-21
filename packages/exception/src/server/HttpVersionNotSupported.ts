import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 505 HTTP Version Not Supported
 *
 * The HTTP version used in the request is not supported by the server.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505
 * @see https://httpstatus.in/505/
 */
export class HttpVersionNotSupported extends HttpServerException {
  static readonly STATUS = 505;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    // Exception from all other classes: we add here the Http prefix in the name
    // Cause the default message should include http.
    const name = 'HttpVersionNotSupported';
    super(505, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpVersionNotSupported.prototype);
    this.name = name;
  }
}
