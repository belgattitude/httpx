import type { HttpClientException } from '../base/HttpClientException';
import type { HttpException } from '../base/HttpException';
import type { HttpServerException } from '../base/HttpServerException';
import type { HttpUnprocessableEntity } from '../client/HttpUnprocessableEntity';
import type { HttpExceptionParams } from './HttpExceptionParams';
import type { HttpExceptionParamsWithIssues } from './HttpExceptionParamsWithIssues';

export type HttpStatusCodesWithIssues = 422;

export type HttpExceptionParamsFromStatus<T> =
  T extends HttpStatusCodesWithIssues
    ? HttpExceptionParamsWithIssues
    : HttpExceptionParams;
export type HttpExceptionFromStatus<T> = T extends HttpStatusCodesWithIssues
  ? HttpUnprocessableEntity
  : HttpClientException | HttpException | HttpServerException;
