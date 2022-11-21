import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 416 Range Not Satisfiable (client)
 *
 * The range specified by the Range header field in the request cannot be fulfilled.
 * It's possible that the range is outside the size of the target URI's data.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416
 * @see https://httpstatus.in/416/
 */
export class HttpRangeNotSatisfiable extends HttpClientException {
  static readonly STATUS = 416;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'RangeNotSatisfiable';
    super(416, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpRangeNotSatisfiable.prototype);
    this.name = `Http${name}`;
  }
}
