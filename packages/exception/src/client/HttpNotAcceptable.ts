import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 406 Not acceptable (client)
 *
 * This response is sent when the web server, after performing server-driven content negotiation, doesn't find
 * any content that conforms to the criteria given by the user agent.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
 * @see https://httpstatus.in/406/
 */
const status = 406;
export class HttpNotAcceptable extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpNotAcceptable";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
