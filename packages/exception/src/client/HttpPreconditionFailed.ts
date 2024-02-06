import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 412 Precondition Failed (client)
 *
 * The client has indicated preconditions in its headers which the server does not meet.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
 * @see https://httpstatus.in/412/
 */
const status = 412;
const name = 'PreconditionFailed';
export class HttpPreconditionFailed extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpPreconditionFailed);
  }
}
