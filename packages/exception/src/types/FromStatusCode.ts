import type {
  HttpClientException,
  HttpException,
  HttpServerException,
} from '../base';
import type { HttpUnprocessableEntity } from '../client';
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
