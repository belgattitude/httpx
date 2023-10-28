import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 503 Service Unavailable
 *
 * The server is not ready to handle the request. Common causes are a server that is down for maintenance
 * or that is overloaded. Note that together with this response, a user-friendly page explaining the problem
 * should be sent.
 *
 * This response should be used for temporary conditions and the Retry-After HTTP header should, if possible,
 * contain the estimated time before the recovery of the service. The webmaster must also take care about the
 * caching-related headers that are sent along with this response, as these temporary condition responses
 * should usually not be cached.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
 * @see https://httpstatus.in/503/
 */
export class HttpServiceUnavailable extends HttpServerException {
  static readonly STATUS = 503;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpServiceUnavailable, msgOrParams));
    initProtoAndName(this, HttpServiceUnavailable);
  }
}
