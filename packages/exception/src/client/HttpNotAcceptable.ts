import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 406 Not acceptable (client)
 *
 * This response is sent when the web server, after performing server-driven content negotiation, doesn't find
 * any content that conforms to the criteria given by the user agent.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
 * @see https://httpstatus.in/406/
 */
const status = 406;
const name = 'NotAcceptable';
export class HttpNotAcceptable extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpNotAcceptable);
  }
}
