import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 402 Payment required (client)
 *
 * This response code is reserved for future use. The initial aim for creating this code was using it for digital
 * payment systems, however this status code is used very rarely and no standard convention exists.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402
 * @see https://httpstatus.in/402/
 */
export class HttpPaymentRequired extends HttpClientException {
  static readonly STATUS = 402;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpPaymentRequired, msgOrParams));
    initProtoAndName(this, HttpPaymentRequired);
  }
}
