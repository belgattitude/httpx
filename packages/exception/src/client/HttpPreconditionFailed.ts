import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 412 Precondition Failed (client)
 *
 * The client has indicated preconditions in its headers which the server does not meet.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
 * @see https://httpstatus.in/412/
 */
const status = 412;
export class HttpPreconditionFailed extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpPreconditionFailed";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
