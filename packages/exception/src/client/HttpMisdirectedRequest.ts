import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperData, setProto } from '../utils';

/**
 * 421 Misdirected Request (client)
 *
 * The request was directed at a server that is not able to produce a response. This can be sent by a server that
 * is not configured to produce responses for the combination of scheme and authority that are included
 * in the request URI.
 *
 * @see https://httpstatus.in/421/
 */
export class HttpMisdirectedRequest extends HttpClientException {
  static readonly STATUS = 421;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperData(HttpMisdirectedRequest, msgOrParams));
    setProto(this, HttpMisdirectedRequest);
  }
}
