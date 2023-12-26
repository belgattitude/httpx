import type { HttpErrorStatusCodeOrNumber } from './HttpErrorStatusCodeOrNumber';

export interface ErrorWithErrorStatusCode extends Error {
  statusCode: HttpErrorStatusCodeOrNumber;
}
