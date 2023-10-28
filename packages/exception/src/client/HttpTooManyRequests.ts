import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 429 Too Many Requests (client)
 *
 * The user has sent too many requests in a given amount of time ("rate limiting").
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
 * @see https://httpstatus.in/429/
 */
export class HttpTooManyRequests extends HttpClientException {
  static readonly STATUS = 429;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpTooManyRequests, msgOrParams));
    initProtoAndName(this, HttpTooManyRequests);
  }
}
