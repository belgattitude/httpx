import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 429 Too Many Requests (client)
 *
 * The user has sent too many requests in a given amount of time ("rate limiting").
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
 * @see https://httpstatus.in/429/
 */
const status = 429;
export class HttpTooManyRequests extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpTooManyRequests";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
