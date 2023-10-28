import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import type { HttpValidationIssue } from '../types/HttpValidationIssue';
import type { ValidationError } from '../types/ValidationError';
import { getSuperData, setProto } from '../utils';

type HttpExceptionParamsWithErrors = HttpExceptionParams & {
  /** @deprecated use issues in 422 HttpUnprocessableEntity instead */
  errors?: HttpValidationIssue[];
};

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
  /** @deprecated use issues in 422 HttpUnprocessableEntity instead */
  public readonly errors: ValidationError[];
  constructor(msgOrParams?: HttpExceptionParamsWithErrors | string) {
    const { errors = [], ...p } =
      typeof msgOrParams === 'string' ? {} : msgOrParams ?? {};
    super(...getSuperData(HttpBadRequest, p));
    this.errors = errors;
    setProto(this, HttpBadRequest);
  }
}
