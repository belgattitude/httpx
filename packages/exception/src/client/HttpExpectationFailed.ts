import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * Client status 417
 *
 * The HTTP 417 Expectation Failed client error response code indicates that the expectation given
 * in the request's Expect header could not be met.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417
 * @see https://httpstatus.in/417/
 */
export class HttpExpectationFailed extends HttpClientException {
  static readonly STATUS = 417;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'ExpectationFailed';
    super(417, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpExpectationFailed.prototype);
    this.name = `Http${name}`;
  }
}
