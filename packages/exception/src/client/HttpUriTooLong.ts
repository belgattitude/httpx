import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 414 URI too long (client)
 *
 * The URI requested by the client is longer than the server is willing to interpret.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
 * @see https://httpstatus.in/414/
 */
export class HttpUriTooLong extends HttpClientException {
  static readonly STATUS = 414;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpUriTooLong, msgOrParams));
    initProtoAndName(this, HttpUriTooLong);
  }
}
