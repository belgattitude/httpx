import type { HttpException } from '../base';
import type { HttpMethod } from './HttpMethod';

export type HttpExceptionParams = {
  /**
   * Indicates the original cause of the HttpException.
   * Will be ignored/discarded if the runtime (browser / node version) does not support it
   * or there's no polyfill
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
   */
  cause?: Error | HttpException | undefined;
  /**
   * Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'cdg1::h99k2-1664884491087-b41a2832f559'...)
   * Do not use this to indicate http status code, the `statusCode` is built-in.
   */
  code?: string | undefined;

  /**
   * Inform about an unique error identifier (ie: nanoid, cuid, sentry...)
   */
  errorId?: string | undefined;

  /**
   * Exception message, if not provided the default is the exception
   * name in natural language (ie: "HttpNotFound" -> "Not found")
   */
  message?: string | undefined;

  /**
   * Inform about http method
   */
  method?: HttpMethod | undefined;

  /**
   * Indicates the original url that caused the error.
   */
  url?: string | undefined;
};
