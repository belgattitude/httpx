import { supportsErrorCause } from '../support/supportsErrorCause';
import type { HttpErrorStatusCodeOrNumber } from '../types';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import type { HttpMethod } from '../types/HttpMethod';
import { getSuper } from '../utils/getSuper';
import { initProtoAndName } from '../utils/initProtoAndName';

export class HttpException extends Error implements HttpExceptionParams {
  /**
   * If set and the runtime (browser or node) supports it
   * you can get back the error cause
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
   */
  public override readonly cause?: Error | HttpException;
  /**
   * Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)
   */
  public readonly code: string | undefined;

  /**
   * Inform about an unique error identifier (ie: nanoid, cuid...)
   */
  public readonly errorId: string | undefined;

  /**
   * Http method
   */
  public readonly method: HttpMethod | undefined;

  /**
   * Http error status code (400-599)
   */
  public readonly statusCode: HttpErrorStatusCodeOrNumber;

  /**
   * Indicates the original url that caused the error.
   */
  public readonly url: string | undefined;

  /**
   * Construct a new HttpException class
   *
   * @param statusCode http status code between 400-599, no checks are done on the validity of the number.
   * @param msgOrParams either a message or an object containing HttpExceptionParams
   */
  constructor(
    statusCode: HttpErrorStatusCodeOrNumber,
    msgOrParams?: HttpExceptionParams | string
  ) {
    const { cause: c, message: m, ...p } = getSuper(HttpException, msgOrParams);
    super(m);
    if (supportsErrorCause() && c instanceof Error) {
      this.cause = c;
    }
    this.statusCode = statusCode;
    this.url = p.url;
    this.errorId = p.errorId;
    this.code = p.code;
    this.method = p.method;
    initProtoAndName(this, HttpException);
  }
}
