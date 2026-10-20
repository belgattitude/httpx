import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 407 Proxy authentication required (client)
 *
 * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407
 * @see https://httpstatus.in/407/
 */
const status = 407;
export class HttpProxyAuthenticationRequired extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string =
    "HttpProxyAuthenticationRequired";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
