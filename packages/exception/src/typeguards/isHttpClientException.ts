import { HttpClientException } from '../base/HttpClientException';

/**
 * Test whether a value is an instanceof HttpClientException
 * and its statusCode is in the 4xx range when the parameter
 * checkStatusCode is true (enabled by default).
 */
export const isHttpClientException = (
  error: unknown,
  /**
   * Ensure statusCode is in the client range [>=400, <500], true by default
   */
  checkStatusCode = true
): error is HttpClientException => {
  return (
    error instanceof HttpClientException &&
    (!checkStatusCode || (error.statusCode > 399 && error.statusCode < 500))
  );
};
