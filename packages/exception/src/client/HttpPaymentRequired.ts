import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * 402 Payment required (client)
 *
 * This response code is reserved for future use. The initial aim for creating this code was using it for digital
 * payment systems, however this status code is used very rarely and no standard convention exists.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402
 * @see https://httpstatus.in/402/
 */

const status = 402;
const name = 'PaymentRequired';
export class HttpPaymentRequired extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpPaymentRequired);
  }
}
