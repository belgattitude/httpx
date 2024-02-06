import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 451 Unavailable For Legal Reasons (client)
 *
 * The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
 * @see https://httpstatus.in/451/
 */

const status = 451;
const name = 'UnavailableForLegalReasons';
export class HttpUnavailableForLegalReasons extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpUnavailableForLegalReasons);
  }
}
