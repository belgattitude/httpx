import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperData, setProto } from '../utils';

/**
 * 418 I'm a teapot (client)
 *
 * The server refuses the attempt to brew coffee with a teapot.
 *
 * @see https://httpstatus.in/418/
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
 */
export class HttpImATeapot extends HttpClientException {
  static readonly STATUS = 418;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperData(HttpImATeapot, msgOrParams));
    setProto(this, HttpImATeapot);
  }
}
