import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 510 Not Extended (server)
 *
 * Further extensions to the request are required for the server to fulfill it.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510
 * @see https://httpstatus.in/510/
 */

const status = 510;
const name = 'NotExtended';
export class HttpNotExtended extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpNotExtended);
  }
}
