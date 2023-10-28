import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperData, setProto } from '../utils';

/**
 * 407 Proxy authentication required (client)
 *
 * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407
 * @see https://httpstatus.in/407/
 */
export class HttpProxyAuthenticationRequired extends HttpClientException {
  static readonly STATUS = 407;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperData(HttpProxyAuthenticationRequired, msgOrParams));
    setProto(this, HttpProxyAuthenticationRequired);
  }
}
