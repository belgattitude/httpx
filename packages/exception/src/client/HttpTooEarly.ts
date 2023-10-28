import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 425 Too early (client / experimental)
 *
 * Indicates that the server is unwilling to risk processing a request that might be replayed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425
 */
export class HttpTooEarly extends HttpClientException {
  static readonly STATUS = 425;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpTooEarly, msgOrParams));
    initProtoAndName(this, HttpTooEarly);
  }
}
