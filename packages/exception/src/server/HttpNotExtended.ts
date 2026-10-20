import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 510 Not Extended (server)
 *
 * Further extensions to the request are required for the server to fulfill it.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510
 * @see https://httpstatus.in/510/
 */

const status = 510;
export class HttpNotExtended extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpNotExtended";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
