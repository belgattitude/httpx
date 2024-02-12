import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * 426 Upgrade Required (client)
 *
 * The server refuses to perform the request using the current protocol but might be willing to do so after
 * the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response
 * to indicate the required protocol(s).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426
 */

const status = 426;
const name = 'UpgradeRequired';
export class HttpUpgradeRequired extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpUpgradeRequired);
  }
}
