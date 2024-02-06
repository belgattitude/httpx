import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 429 Too Many Requests (client)
 *
 * The user has sent too many requests in a given amount of time ("rate limiting").
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
 * @see https://httpstatus.in/429/
 */
const status = 429;
const name = 'TooManyRequests';
export class HttpTooManyRequests extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpTooManyRequests);
  }
}
