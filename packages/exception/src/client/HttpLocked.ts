import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuperArgs, initProtoAndName } from '../utils';

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
    super(...getSuperArgs(HttpLocked, msgOrParams));
    initProtoAndName(this, HttpLocked);
  }
}
