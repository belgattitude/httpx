import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 400 Bad Request (client)
 *
 * The server cannot or will not process the request due to something that is perceived to be a client error
 * (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 *
 * Note that a lot of apis/frameworks uses 422 Unprocessable Entity to indicate (form field) validation errors
 * rather the 400 Bad Request status code.
 *
 * @see https://httpstatus.in/400/
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export class HttpBadRequest extends HttpClientException {
  static readonly STATUS = 400;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpBadRequest, msgOrParams));
    initProtoAndName(this, HttpBadRequest);
  }
}
