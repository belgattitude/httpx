import type { HttpStatusCode } from '../types/HttpStatusCode';

/**
 * Check if the provided value is a valid http status code
 */
export const isHttpErrorStatusCode = <
  T extends HttpStatusCode = HttpStatusCode,
>(
  statusCode: unknown
): statusCode is T => {
  return (
    typeof statusCode === 'number' && statusCode >= 400 && statusCode < 600
  );
};
