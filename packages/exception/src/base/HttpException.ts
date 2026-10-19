import type { HttpErrorStatusCodeOrNumber } from "../types";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import type { HttpMethod } from "../types/HttpMethod";
import { brandKey, hasBrand } from "../utils/brand";
import { getMsgFromCls } from "../utils/getMsgFromCls";

export class HttpException extends Error implements HttpExceptionParams {
  static readonly [brandKey]: string = "HttpException";

  /**
   * Also recognize instances created by another copy of the same
   * @httpx/exception major version (ie: esm and cjs builds, duplicated installs).
   */
  static override [Symbol.hasInstance](value: unknown): boolean {
    return super[Symbol.hasInstance](value) || hasBrand(value, this);
  }

  // Fields are declared only (not emitted as class fields): they are all
  // assigned in the constructor and a class field would reset `cause`
  // after super().

  /**
   * If set and the runtime (browser or node) supports it
   * you can get back the error cause
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
   */
  declare public readonly cause?: Error | HttpException | undefined;

  /**
   * Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)
   */
  declare public readonly code: string | undefined;

  /**
   * Inform about an unique error identifier (ie: nanoid, cuid...)
   */
  declare public readonly errorId: string | undefined;

  /**
   * Http method
   */
  declare public readonly method: HttpMethod | undefined;

  /**
   * Http error status code (400-599)
   */
  declare public readonly statusCode: HttpErrorStatusCodeOrNumber;

  /**
   * Indicates the original url that caused the error.
   */
  declare public readonly url: string | undefined;

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
    const { cause, code, errorId, message, method, url }: HttpExceptionParams =
      typeof msgOrParams === "string"
        ? { message: msgOrParams }
        : (msgOrParams ?? {});
    // the concrete class being constructed (ie: HttpNotFound), subclasses
    // without their own brand inherit the one of their parent
    const name = new.target[brandKey];
    // the native cause option is ignored by runtimes not supporting it
    super(
      message ?? getMsgFromCls(name),
      cause instanceof Error ? { cause } : undefined
    );
    this.code = code;
    this.errorId = errorId;
    this.method = method;
    this.statusCode = statusCode;
    this.url = url;
    this.name = name;
  }
}
