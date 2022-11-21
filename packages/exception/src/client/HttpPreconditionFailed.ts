import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 412 Precondition Failed (client)
 *
 * The client has indicated preconditions in its headers which the server does not meet.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
 * @see https://httpstatus.in/412/
 */
export class HttpPreconditionFailed extends HttpClientException {
  static readonly STATUS = 412;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'PreconditionFailed';
    super(412, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpPreconditionFailed.prototype);
    this.name = `Http${name}`;
  }
}
