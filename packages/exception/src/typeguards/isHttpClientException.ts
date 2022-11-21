import { HttpClientException } from '../base';

export const isHttpClientException = (
  error: unknown
): error is HttpClientException => {
  return error instanceof HttpClientException;
};
