import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 511 Network Authentication Required (server)
 *
 * Indicates that the client needs to authenticate to gain network access.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511
 * @see https://httpstatus.in/511/
 */

const status = 511;
export class HttpNetworkAuthenticationRequired extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string =
    "HttpNetworkAuthenticationRequired";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
