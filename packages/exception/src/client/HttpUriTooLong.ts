import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 414 URI too long (client)
 *
 * The URI requested by the client is longer than the server is willing to interpret.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
 * @see https://httpstatus.in/414/
 */
const status = 414;
export class HttpUriTooLong extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpUriTooLong";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
