import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 411 Length required
 *
 * Server rejected the request because the Content-Length header field is not defined and the server requires it.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411
 * @see https://httpstatus.in/411/
 */
export class HttpLengthRequired extends HttpClientException {
  static readonly STATUS = 411;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpLengthRequired, msgOrParams));
    initProtoAndName(this, HttpLengthRequired);
  }
}
