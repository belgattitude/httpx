import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 425 Too early (client / experimental)
 *
 * Indicates that the server is unwilling to risk processing a request that might be replayed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425
 */
const status = 425;
const name = 'TooEarly';
export class HttpTooEarly extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpTooEarly);
  }
}
