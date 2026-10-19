import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 451 Unavailable For Legal Reasons (client)
 *
 * The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
 * @see https://httpstatus.in/451/
 */

const status = 451;
export class HttpUnavailableForLegalReasons extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string =
    "HttpUnavailableForLegalReasons";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
