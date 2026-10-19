import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 500 Internal Server Error (server)
 *
 * The server has encountered a situation it does not know how to handle.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 * @see https://httpstatus.in/500/
 */

const status = 500;
export class HttpInternalServerError extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpInternalServerError";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
