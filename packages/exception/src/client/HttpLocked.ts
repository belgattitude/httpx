import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper } from '../utils';

/**
 * 423 Locked (client / webdav specific)
 *
 * The source or destination resource of a method is locked. This response SHOULD contain an
 * appropriate precondition or postcondition code, such as ‘lock-token-submitted’ or ‘no-conflicting-lock’.
 *
 * @see https://httpstatus.in/423/
 */
export class HttpLocked extends HttpClientException {
  static readonly STATUS = 423;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'Locked';
    super(423, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpLocked.prototype);
    this.name = `Http${name}`;
  }
}
