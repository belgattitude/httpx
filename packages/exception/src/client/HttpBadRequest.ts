import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import type { ValidationError } from '../types/ValidationError';
import { getSuper } from '../utils';

/**
 * 400 Bad Request (client)
 *
 * Be aware that a lot of apis/frameworks will use 422 Unprocessable Entity to indicate (form field) validation errors
 * when posting data (rails, github, api-platform...).
 *
 * @see https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#client-errors
 *
 * The server cannot or will not process the request due to something that is perceived to be a client error
 * (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 *
 * @see https://httpstatus.in/400/
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export class HttpBadRequest extends HttpClientException {
  static readonly STATUS = 400;
  public readonly errors: ValidationError[];
  constructor(
    msgOrParams?:
      | (HttpExceptionParams & {
          /** @deprecated use errors 422 HttpUnprocessableEntity instead */
          errors?: ValidationError[];
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
