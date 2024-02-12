import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * 501 Not Implemented
 *
 * The request method is not supported by the server and cannot be handled. The only methods that
 * servers are required to support (and therefore that must not return this code) are GET and HEAD.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
 * @see https://httpstatus.in/501/
 */

const status = 501;
const name = 'NotImplemented';
export class HttpNotImplemented extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpNotImplemented);
  }
}
