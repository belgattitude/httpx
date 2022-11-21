import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 424 Failed dependency (client / webdav specific)
 *
 * The method could not be performed on the resource because the requested action depended on another action
 * and that action failed.
 *
 * For example, if a command in a PROPPATCH method fails, then, at minimum, the rest of the commands will
 * also fail with 424 Failed Dependency.
 *
 * @see https://httpstatus.in/424/
 */
export class HttpFailedDependency extends HttpClientException {
  static readonly STATUS = 424;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'FailedDependency';
    super(424, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpFailedDependency.prototype);
    this.name = `Http${name}`;
  }
}
