import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 501 Not Implemented
 *
 * The request method is not supported by the server and cannot be handled. The only methods that
 * servers are required to support (and therefore that must not return this code) are GET and HEAD.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
 * @see https://httpstatus.in/501/
 */

const status = 501;
export class HttpNotImplemented extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpNotImplemented";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
