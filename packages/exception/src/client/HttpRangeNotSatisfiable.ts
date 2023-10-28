import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 416 Range Not Satisfiable (client)
 *
 * The range specified by the Range header field in the request cannot be fulfilled.
 * It's possible that the range is outside the size of the target URI's data.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416
 * @see https://httpstatus.in/416/
 */
export class HttpRangeNotSatisfiable extends HttpClientException {
  static readonly STATUS = 416;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpRangeNotSatisfiable, msgOrParams));
    initProtoAndName(this, HttpRangeNotSatisfiable);
  }
}
