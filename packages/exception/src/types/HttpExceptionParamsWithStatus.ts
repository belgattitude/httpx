import type { HttpErrorStatusCode } from './HttpErrorStatusCode';
import type { HttpExceptionParams } from './HttpExceptionParams';

export type HttpExceptionParamsWithStatus = HttpExceptionParams & {
  statusCode: HttpErrorStatusCode;
};
