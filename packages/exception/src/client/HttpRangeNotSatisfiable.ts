import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 416 Range Not Satisfiable (client)
 *
 * The range specified by the Range header field in the request cannot be fulfilled.
 * It's possible that the range is outside the size of the target URI's data.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416
 * @see https://httpstatus.in/416/
 */
const status = 416;
const name = 'RangeNotSatisfiable';
export class HttpRangeNotSatisfiable extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpRangeNotSatisfiable);
  }
}
