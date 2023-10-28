import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import type { HttpValidationIssue } from '../types/HttpValidationIssue';
import { getSuper } from '../utils';

/**
 * 400 Bad Request (client)
 *
 * The server cannot or will not process the request due to something that is perceived to be a client error
 * (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 *
 * Note that a lot of apis/frameworks uses 422 Unprocessable Entity to indicate (form field) validation errors
 * rather the 400 Bad Request status code.
 *
 * @see https://httpstatus.in/400/
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export class HttpBadRequest extends HttpClientException {
  static readonly STATUS = 400;
  public readonly errors: HttpValidationIssue[];
  constructor(
    msgOrParams?:
      | (HttpExceptionParams & {
          /** @deprecated use errors 422 HttpUnprocessableEntity instead */
          errors?: HttpValidationIssue[];
        })
      | string
  ) {
    const name = 'BadRequest';
    super(400, getSuper(name, msgOrParams));
    this.errors =
      typeof msgOrParams === 'object' && msgOrParams.errors
        ? msgOrParams.errors
        : [];
    Object.setPrototypeOf(this, HttpBadRequest.prototype);
    this.name = `Http${name}`;
  }
}
