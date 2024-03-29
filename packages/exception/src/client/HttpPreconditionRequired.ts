import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * 428 Precondition Required (client)
 *
 * The origin server requires the request to be conditional. This response is intended to prevent the
 * 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the
 * server, when meanwhile a third party has modified the state on the server, leading to a conflict.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428
 * @see https://httpstatus.in/428/
 */
const status = 428;
const name = 'PreconditionRequired';
export class HttpPreconditionRequired extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpPreconditionRequired);
  }
}
