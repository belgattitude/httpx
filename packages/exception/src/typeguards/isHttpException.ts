import { HttpException } from '../base/HttpException';

/**
 * Test whether a value is an instanceof HttpException
 * and its statusCode is in the 4xx and 5xx ranges when the parameter
 * checkStatusCode is true (enabled by default).
 */
export const isHttpException = (
  error: unknown /**
   * Ensure statusCode is in the error range [>=400, <600], true by default
   */,
  checkStatusCode = true
): error is HttpException => {
  return (
    error instanceof HttpException &&
    (!checkStatusCode || (error.statusCode > 399 && error.statusCode < 600))
  );
};
