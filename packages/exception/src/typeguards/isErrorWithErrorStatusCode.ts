import type { ErrorWithErrorStatusCode } from '../types';
import { isHttpErrorStatusCode } from './isHttpErrorStatusCode';

/**
 * Checks if a value is an instanceof Error and has a statusCode field
 * indicating an error http status (4xx or 5xx)
 */
export const isErrorWithErrorStatusCode = (
  error: unknown
): error is ErrorWithErrorStatusCode => {
  return (
    error instanceof Error &&
    isHttpErrorStatusCode((error as ErrorWithErrorStatusCode)?.statusCode)
  );
};
