import { HttpServerException } from '../base';

/**
 * Test whether a value is an instanceof HttpServerException
 * and its statusCode is in the 5xx range when the parameter
 * checkStatusCode is true (enabled by default).
 */
export const isHttpServerException = (
  error: unknown,
  /**
   * Ensure statusCode is in the server range [>=500, <600], true by default
   */
  checkStatusCode = true
): error is HttpServerException => {
  return (
    error instanceof HttpServerException &&
    (!checkStatusCode || (error.statusCode > 499 && error.statusCode < 600))
  );
};
