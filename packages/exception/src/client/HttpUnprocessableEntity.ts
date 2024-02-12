import { HttpClientException } from '../base/HttpClientException';
import type { HttpExceptionParamsWithIssues } from '../types/HttpExceptionParamsWithIssues';
import type { HttpValidationIssue } from '../types/HttpValidationIssue';
import { getNormalizedParams } from '../utils/getNormalizedParams';
import { initProtoAndName } from '../utils/initProtoAndName';

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

const status = 422;
const name = 'UnprocessableEntity';
export class HttpUnprocessableEntity extends HttpClientException {
  static readonly STATUS = status;
  public readonly issues: HttpValidationIssue[];
  constructor(msgOrParams?: HttpExceptionParamsWithIssues | string) {
    const { issues = [], ...p } =
      typeof msgOrParams === 'string' ? {} : msgOrParams ?? {};

    super(status, getNormalizedParams(name, msgOrParams));
    this.issues = issues;
    initProtoAndName(this, name, HttpUnprocessableEntity);
  }
}
