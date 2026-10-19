import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 411 Length required
 *
 * Server rejected the request because the Content-Length header field is not defined and the server requires it.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411
 * @see https://httpstatus.in/411/
 */

const status = 411;
export class HttpLengthRequired extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpLengthRequired";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
