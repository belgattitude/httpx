import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperData, setProto } from '../utils';

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
    super(...getSuperData(HttpExpectationFailed, msgOrParams));
    setProto(this, HttpExpectationFailed);
  }
}
