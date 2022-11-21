import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 506 Variant Also Negotiates (server)
 *
 * The server has an internal configuration error: the chosen variant resource is configured to engage
 * in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506
 * @see https://httpstatus.in/506/
 */
export class HttpVariantAlsoNegotiates extends HttpServerException {
  static readonly STATUS = 506;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'VariantAlsoNegotiates';
    super(506, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpVariantAlsoNegotiates.prototype);
    this.name = `Http${name}`;
  }
}
