import { HttpClientException } from "../../base/HttpClientException";
import { HttpException } from "../../base/HttpException";
import { HttpServerException } from "../../base/HttpServerException";

export const baseExceptionMap = {
  HttpClientException,
  HttpException,
  HttpServerException,
};

/**
 * Whether the provided name is one of HttpException, HttpClientException, HttpServerException
 */
export const isBaseHttpException = (
  name: string
): name is keyof typeof baseExceptionMap =>
  // own keys only: inherited ones (ie: 'constructor', 'toString') are not exception classes
  Object.hasOwn(baseExceptionMap, name);
