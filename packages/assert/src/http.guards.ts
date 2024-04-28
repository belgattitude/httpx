import { httpMethods } from './http.consts';
import type { HttpMethod } from './http.types';

/**
 * Check whether the value is a valid http method (GET, PUT...) in
 * a case-insensitive manner.
 */
export const isHttpValidMethod = (v: unknown): v is HttpMethod => {
  return (
    typeof v === 'string' &&
    (httpMethods as unknown as string[]).includes(v.toUpperCase())
  );
};

export const isHttpMethod = <T extends HttpMethod>(
  method: T,
  v: unknown
): v is T => {
  return typeof v === 'string' && method === v.toUpperCase();
};
