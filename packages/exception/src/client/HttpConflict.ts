import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 409 Conflict (client)
 *
 * This response is sent when a request conflicts with the current state of the server.
 *
 * @see https://httpstatus.in/409/
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
export class HttpConflict extends HttpClientException {
  static readonly STATUS = 409;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpConflict, msgOrParams));
    initProtoAndName(this, HttpConflict);
  }
}
