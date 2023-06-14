import type { HttpStatusCode } from '../types/HttpStatusCode';

/**
 * Check if the provided value is a valid http status code
 */
export const isHttpStatusCode = (
  statusCode: unknown
): statusCode is HttpStatusCode => {
  if (typeof statusCode !== 'number') {
    return false;
  }
  return statusCode > 99 && statusCode < 600;
};
