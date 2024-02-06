import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 414 URI too long (client)
 *
 * The URI requested by the client is longer than the server is willing to interpret.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
 * @see https://httpstatus.in/414/
 */
const status = 414;
const name = 'UriTooLong';
export class HttpUriTooLong extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpUriTooLong);
  }
}
