import type { ObjectWithErrorStatusCode } from '../types/ObjectWithErrorStatusCode';
import { isHttpErrorStatusCode } from './isHttpErrorStatusCode';

/**
 * Checks if a value is an object (or a plain object) and has a statusCode field
 * indicating an error http status (4xx or 5xx)
 */
export const isObjectWithErrorStatusCode = (
  objOrPlainObject: unknown
): objOrPlainObject is ObjectWithErrorStatusCode => {
  return isHttpErrorStatusCode(
    (objOrPlainObject as ObjectWithErrorStatusCode)?.statusCode
  );
};
