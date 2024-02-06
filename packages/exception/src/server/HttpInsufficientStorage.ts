import { HttpServerException } from '../base/HttpServerException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 507 Insufficient Storage (client / webdav specific)
 *
 * The method could not be performed on the resource because the server is unable to store the representation
 * needed to successfully complete the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507
 */
const status = 507;
const name = 'InsufficientStorage';
export class HttpInsufficientStorage extends HttpServerException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpInsufficientStorage);
  }
}
