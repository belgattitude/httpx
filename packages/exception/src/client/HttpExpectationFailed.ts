import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * Client status 417
 *
 * The HTTP 417 Expectation Failed client error response code indicates that the expectation given
 * in the request's Expect header could not be met.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417
 * @see https://httpstatus.in/417/
 */
const status = 417;
const name = 'ExpectationFailed';
export class HttpExpectationFailed extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpExpectationFailed);
  }
}
