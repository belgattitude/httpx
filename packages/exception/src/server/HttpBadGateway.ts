import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 502 Bad Gateway (server)
 *
 * This error response means that the server, while working as a gateway to get a response needed to
 * handle the request, got an invalid response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
 */
const status = 502;

export class HttpBadGateway extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpBadGateway";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
