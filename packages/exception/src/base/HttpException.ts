import { supportsErrorCause } from '../support';
import type { HttpExceptionParams, HttpMethod } from '../types';
import { getSuper } from '../utils';

export class HttpException extends Error {
  /**
   * Http error status code (400-599)
   */
  public readonly statusCode: number;
  /**
   * Indicates the original url that caused the error.
   */
  public readonly url: string | undefined;

  /**
   * Http method
   */
  public readonly method: HttpMethod | undefined;

  /**
   * Custom additional code (ie: 'AbortError', 'CODE-1234'...)
   */
  public readonly code: string | undefined;

  /**
   * Inform about an unique error identifier (ie: nanoid, cuid...)
   */
  public readonly errorId: string | undefined;

  /**
   * If set and the runtime (browser or node) supports it
   * you can get back the error cause
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
   */
  public readonly cause?: Error | HttpException;

  /**
   * Construct a new HttpException class
   *
   * @param statusCode http status code between 400-599, no checks are done on the validity of the number.
   * @param msgOrParams either a message or an object containing HttpExceptionParams
   */
  constructor(statusCode: number, msgOrParams?: HttpExceptionParams | string) {
    const name = 'HttpException';
    const { message, url, cause, errorId, code, method } = getSuper(
      name,
      msgOrParams
    );
    super(message);
    if (supportsErrorCause() && cause instanceof Error) {
      this.cause = cause;
    }
    this.statusCode = statusCode;
    this.url = url;
    this.errorId = errorId;
    this.code = code;
    this.method = method;

    Object.setPrototypeOf(this, HttpException.prototype);
    this.name = name;
  }
}
