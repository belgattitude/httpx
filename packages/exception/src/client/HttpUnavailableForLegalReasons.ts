import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperData, setProto } from '../utils';

/**
 * 451 Unavailable For Legal Reasons (client)
 *
 * The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
 * @see https://httpstatus.in/451/
 */
export class HttpUnavailableForLegalReasons extends HttpClientException {
  static readonly STATUS = 451;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperData(HttpUnavailableForLegalReasons, msgOrParams));
    setProto(this, HttpUnavailableForLegalReasons);
  }
}
