import type { HttpErrorStatusCodeOrNumber } from '../types/HttpErrorStatusCodeOrNumber';

export const isHttpErrorStatusCode = <
  T extends HttpErrorStatusCodeOrNumber = HttpErrorStatusCodeOrNumber,
>(
  statusCode: unknown
): statusCode is T => {
  return typeof statusCode === 'number' && statusCode > 399 && statusCode < 600;
};
