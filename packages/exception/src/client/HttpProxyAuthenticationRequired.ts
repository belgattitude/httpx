import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 407 Proxy authentication required (client)
 *
 * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407
 * @see https://httpstatus.in/407/
 */
const status = 407;
const name = 'ProxyAuthenticationRequired';
export class HttpProxyAuthenticationRequired extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpProxyAuthenticationRequired);
  }
}
