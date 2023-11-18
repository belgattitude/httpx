import type { HttpExceptionParams } from './HttpExceptionParams';
import type { HttpValidationIssue } from './HttpValidationIssue';

/**
 * Special case for 422 UnprocessableEntity
 */
export type HttpExceptionParamsWithIssues = HttpExceptionParams & {
  issues?: HttpValidationIssue[];
};
