import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 418 I'm a teapot (client)
 *
 * The server refuses the attempt to brew coffee with a teapot.
 *
 * @see https://httpstatus.in/418/
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
 */

const status = 418;

export class HttpImATeapot extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpImATeapot";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
