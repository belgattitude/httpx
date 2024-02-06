import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 418 I'm a teapot (client)
 *
 * The server refuses the attempt to brew coffee with a teapot.
 *
 * @see https://httpstatus.in/418/
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
 */

const status = 418;
const name = 'ImATeapot';

export class HttpImATeapot extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpImATeapot);
  }
}
