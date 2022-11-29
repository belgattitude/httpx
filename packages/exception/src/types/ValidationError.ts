/**
 * Related to HttpBadRequest, ValidationError contains additional validation info.
 * Slightly inspired from https://jsonapi.org/format/1.2/#error-objects
 * and zod (path).
 */
export type ValidationError = {
  /** Param name or path, ie: 'email' or ['addresses', 0, 'line1'] */
  path: string | (string | number)[];
  /** A short, human-readable summary of the problem */
  message: string;
  /** An application-specific error code, expressed as a string value. */
  code?: string;
};
