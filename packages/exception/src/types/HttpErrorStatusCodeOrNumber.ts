import type { HttpErrorStatusCode } from './HttpErrorStatusCode';

export type HttpErrorStatusCodeOrNumber =
  | HttpErrorStatusCode
  // This allows to get typings for known http error statuses while keeping
  // the freedom to pass an arbitrary number
  // (this trick might be removed by future versions of typescript)
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (number & {});
