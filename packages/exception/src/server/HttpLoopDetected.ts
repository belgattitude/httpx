import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * 508 Loop Detected (server / webdav specific)
 *
 * The server detected an infinite loop while processing the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
 * @see https://httpstatus.in/508/
 */

const status = 508;
const name = 'LoopDetected';
export class HttpLoopDetected extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpLoopDetected);
  }
}
