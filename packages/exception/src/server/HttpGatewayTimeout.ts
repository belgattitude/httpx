import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 504 Gateway Timeout (server)
 *
 * This error response is given when the server is acting as a gateway and cannot get a response in time.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
 * @see https://httpstatus.in/504/
 */
const status = 504;
export class HttpGatewayTimeout extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpGatewayTimeout";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
