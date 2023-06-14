import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper } from '../utils';

/**
 * 426 Upgrade Required (client)
 *
 * The server refuses to perform the request using the current protocol but might be willing to do so after
 * the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response
 * to indicate the required protocol(s).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426
 */
export class HttpUpgradeRequired extends HttpClientException {
  static readonly STATUS = 426;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'UpgradeRequired';
    super(426, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpUpgradeRequired.prototype);
    this.name = `Http${name}`;
  }
}
