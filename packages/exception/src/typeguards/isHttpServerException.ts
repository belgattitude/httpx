import { HttpServerException } from '../base';

export const isHttpServerException = (
  error: unknown
): error is HttpServerException => {
  return error instanceof HttpServerException;
};
