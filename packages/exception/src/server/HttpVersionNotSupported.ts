import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 505 HTTP Version Not Supported
 *
 * The HTTP version used in the request is not supported by the server.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505
 * @see https://httpstatus.in/505/
 */

const status = 505;
export class HttpVersionNotSupported extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpVersionNotSupported";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
