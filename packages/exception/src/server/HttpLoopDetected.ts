import { HttpServerException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

/**
 * 508 Loop Detected (server / webdav specific)
 *
 * The server detected an infinite loop while processing the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
 * @see https://httpstatus.in/508/
 */
export class HttpLoopDetected extends HttpServerException {
  static readonly STATUS = 508;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(...getSuperArgs(HttpLoopDetected, msgOrParams));
    initProtoAndName(this, HttpLoopDetected);
  }
}
