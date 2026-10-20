import { HttpServerException } from "../base/HttpServerException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 508 Loop Detected (server / webdav specific)
 *
 * The server detected an infinite loop while processing the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
 * @see https://httpstatus.in/508/
 */

const status = 508;
export class HttpLoopDetected extends HttpServerException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpLoopDetected";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
