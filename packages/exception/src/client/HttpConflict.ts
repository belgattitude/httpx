import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 409 Conflict (client)
 *
 * This response is sent when a request conflicts with the current state of the server.
 *
 * @see https://httpstatus.in/409/
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
const status = 409;
export class HttpConflict extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpConflict";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
