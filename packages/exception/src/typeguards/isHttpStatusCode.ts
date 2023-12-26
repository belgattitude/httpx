/**
 * Check if the provided value is a valid http status code > 99 and <600
 * @see isHttpErrorStatusCode to ensure error range [4xx,5xx]
 */
export const isHttpStatusCode = (statusCode: unknown): statusCode is number => {
  return typeof statusCode === 'number' && statusCode > 99 && statusCode < 600;
};
