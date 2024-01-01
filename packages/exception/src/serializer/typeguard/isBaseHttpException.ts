import { HttpClientException } from '../../base/HttpClientException';
import { HttpException } from '../../base/HttpException';
import { HttpServerException } from '../../base/HttpServerException';

export const baseExceptionMap = {
  HttpClientException: HttpClientException,
  HttpException: HttpException,
  HttpServerException: HttpServerException,
};

/**
 * Whether the provided name is one of HttpException, HttpClientException, HttpServerException
 */
export const isBaseHttpException = (
  name: string
): name is keyof typeof baseExceptionMap => {
  return Object.keys(baseExceptionMap).includes(name);
};
