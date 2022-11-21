import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

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
export class HttpPreconditionRequired extends HttpClientException {
  static readonly STATUS = 428;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'PreconditionRequired';
    super(428, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpPreconditionRequired.prototype);
    this.name = `Http${name}`;
  }
}
