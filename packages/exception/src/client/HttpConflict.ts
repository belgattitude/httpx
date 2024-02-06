import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 409 Conflict (client)
 *
 * This response is sent when a request conflicts with the current state of the server.
 *
 * @see https://httpstatus.in/409/
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
const status = 409;
const name = 'Conflict';
export class HttpConflict extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpConflict);
  }
}
