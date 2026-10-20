import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 405 Method not allowed (client)
 *
 * The request method is known by the server but is not supported by the target resource.
 * For example, an API may not allow calling DELETE to remove a resource.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
 * @see https://httpstatus.in/405/
 */
const status = 405;
export class HttpMethodNotAllowed extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpMethodNotAllowed";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
