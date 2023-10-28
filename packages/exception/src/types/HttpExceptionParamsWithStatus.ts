import type { HttpExceptionParams } from './HttpExceptionParams';
import type { HttpStatusCode } from './HttpStatusCode';

export type HttpExceptionParamsWithStatus = HttpExceptionParams & {
  statusCode: HttpStatusCode;
};
