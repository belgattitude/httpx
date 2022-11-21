import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 508 Loop Detected (server / webdav specific)
 *
 * The server detected an infinite loop while processing the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
 * @see https://httpstatus.in/508/
 */
export class HttpLoopDetected extends HttpServerException {
  static readonly STATUS = 508;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'LoopDetected';
    super(508, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpLoopDetected.prototype);
    this.name = `Http${name}`;
  }
}
