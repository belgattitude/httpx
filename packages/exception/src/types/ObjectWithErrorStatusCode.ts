import type { HttpErrorStatusCodeOrNumber } from './HttpErrorStatusCodeOrNumber';

/**
 * Object or PlainObject with a indicative statusCode field [4xx,5xx]
 */
export interface ObjectWithErrorStatusCode {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  statusCode: HttpErrorStatusCodeOrNumber;
}
