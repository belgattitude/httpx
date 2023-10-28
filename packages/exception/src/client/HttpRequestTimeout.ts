import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 408 Request timeout (client)
 *
 * This response is sent on an idle connection by some servers, even without any previous request by the client.
 * It means that the server would like to shut down this unused connection. This response is used much more
 * since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing.
 * Also note that some servers merely shut down the connection without sending this message.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
 * @see https://httpstatus.in/408/
 */
export class HttpRequestTimeout extends HttpClientException {
  static readonly STATUS = 408;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpRequestTimeout, msgOrParams));
    initProtoAndName(this, HttpRequestTimeout);
  }
}
