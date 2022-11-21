import { HttpClientException } from '../base';
import type { HttpExceptionParams } from '../types';
import { getSuper } from '../utils';

/**
 * 422 Unprocessable entity (client / webdav specific)
 *
 * The server understands the content type of the request entity (hence a 415 Unsupported Media Type status code
 * is inappropriate), and the syntax of the request entity is correct (thus a 400 Bad Request status code is
 * inappropriate) but was unable to process the contained instructions.
 *
 * For example, this error condition may occur if an XML request body contains well-formed
 * (i.e., syntactically correct), but semantically erroneous, XML instructions.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
 * @see https://httpstatus.in/422/
 */
export class HttpUnprocessableEntity extends HttpClientException {
  static readonly STATUS = 422;
  constructor(msgOrParams?: HttpExceptionParams | string) {
    const name = 'UnprocessableEntity';
    super(422, getSuper(name, msgOrParams));
    Object.setPrototypeOf(this, HttpUnprocessableEntity.prototype);
    this.name = `Http${name}`;
  }
}
