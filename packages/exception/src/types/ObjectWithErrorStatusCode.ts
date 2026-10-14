import type { HttpErrorStatusCodeOrNumber } from "./HttpErrorStatusCodeOrNumber";

/**
 * Object or PlainObject with a indicative statusCode field [4xx,5xx]
 */
export interface ObjectWithErrorStatusCode {
  statusCode: HttpErrorStatusCodeOrNumber;
}
