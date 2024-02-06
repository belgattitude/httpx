import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

/**
 * 401 Unauthorized (client)
 *
 * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
 * That is, the client must authenticate itself to get the requested response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 * @see https://httpstatus.in/401/
 */

const status = 401;
const name = 'Unauthorized';
export class HttpUnauthorized extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpUnauthorized);
  }
}
