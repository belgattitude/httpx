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
  Object.keys(baseExceptionMap).includes(name);
