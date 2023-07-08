import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import type { ValidationError } from '../types/ValidationError';
import { getSuper } from '../utils';

/**
 * 422 Unprocessable entity (client / webdav specific per RFC / used for validation errors in most apis)
 *
 * The server understands the content type of the request entity (hence a 415 Unsupported Media Type status code
 * is inappropriate), and the syntax of the request entity is correct (thus a 400 Bad Request status code is
 * inappropriate) but was unable to process the contained instructions.
 *
 * For example, this error condition may occur if an XML request body contains well-formed
 * (i.e., syntactically correct), but semantically erroneous, XML instructions.
 *
 * Note that a lot of apis/frameworks uses 422 Unprocessable Entity to indicate (form field) validation errors
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
 * @see https://httpstatus.in/422/
 */
export class HttpUnprocessableEntity extends HttpClientException {
  static readonly STATUS = 422;
  public readonly errors: ValidationError[];
  constructor(
    msgOrParams?:
      | (HttpExceptionParams & { errors?: ValidationError[] })
      | string
  ) {
    const name = 'UnprocessableEntity';
    super(422, getSuper(name, msgOrParams));
    this.errors =
      typeof msgOrParams === 'object' && msgOrParams.errors
        ? msgOrParams.errors
        : [];
    Object.setPrototypeOf(this, HttpUnprocessableEntity.prototype);
    this.name = `Http${name}`;
  }
}
