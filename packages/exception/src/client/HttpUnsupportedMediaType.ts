import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 415 Unsupported Media Type (client)
 *
 * The media format of the requested data is not supported by the server, so the server is rejecting the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415
 * @see https://httpstatus.in/415/
 */
const status = 415;
const name = 'UnsupportedMediaType';
export class HttpUnsupportedMediaType extends HttpClientException {
  static readonly STATUS = 415;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpUnsupportedMediaType);
  }
}
