import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 506 Variant Also Negotiates (server)
 *
 * The server has an internal configuration error: the chosen variant resource is configured to engage
 * in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506
 * @see https://httpstatus.in/506/
 */
const status = 506;
const name = 'VariantAlsoNegotiates';
export class HttpVariantAlsoNegotiates extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpVariantAlsoNegotiates);
  }
}
