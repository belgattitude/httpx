import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

/**
 * 423 Locked (client / webdav specific)
 *
 * The source or destination resource of a method is locked. This response SHOULD contain an
 * appropriate precondition or postcondition code, such as ‘lock-token-submitted’ or ‘no-conflicting-lock’.
 *
 * @see https://httpstatus.in/423/
 */
const status = 423;
const name = 'Locked';
export class HttpLocked extends HttpClientException {
  static readonly STATUS = status;
  // static override readonly name = 'HttpNotFound';
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpLocked);
  }
}
