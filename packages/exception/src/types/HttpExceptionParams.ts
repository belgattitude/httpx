export type HttpExceptionParams = {
  /**
   * Exception message, if not provided the default is the exception
   * name in natural language (ie: "HttpNotFound" -> "Not found")
   */
  message?: string;
  /**
   * Indicates the original url that caused the error.
   */
  url?: string;

  /**
   * Inform about http method
   */
  method?:
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';

  /**
   * Custom additional code (ie: 'ERR_UNREACHABLE_SERVICE', 'AbortError', 'CODE-1234'...)
   * Do not use this to indicate http status code, use `statusCode` instead.
   */
  code?: string;

  /**
   * Inform about an unique error identifier (ie: nanoid, cuid, sentry...)
   */
  errorId?: string;

  /**
   * Indicates the original cause of the HttpException.
   * Will be ignored/discarded if the runtime (browser / node version) does not support it
   * or there's no polyfill
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
   */
  cause?: Error;
};
