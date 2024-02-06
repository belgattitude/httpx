import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName2 } from '../utils/initProtoAndName2';

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

const status = 424;
const name = 'FailedDependency';
export class HttpFailedDependency extends HttpClientException {
  static readonly STATUS = status;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, getNormalizedParams(name, msgOrParams));
    initProtoAndName2(this, name, HttpFailedDependency);
  }
}
