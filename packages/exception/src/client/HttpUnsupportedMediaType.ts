import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 415 Unsupported Media Type (client)
 *
 * The media format of the requested data is not supported by the server, so the server is rejecting the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415
 * @see https://httpstatus.in/415/
 */
const status = 415;
export class HttpUnsupportedMediaType extends HttpClientException {
  static readonly STATUS = 415;
  static override readonly [brandKey]: string = "HttpUnsupportedMediaType";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
