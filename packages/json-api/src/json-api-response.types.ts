/**
 * @link https://jsonapi.org/format/#errors
 */
export type JsonApiError = {
  /** an application-specific error code, expressed as a string value. */
  code?: string;
  /** a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized. */
  detail?: string;
  /** a unique identifier for this particular occurrence of the problem. */
  id?: number | string;
  /** a meta object containing non-standard meta-information about the error. */
  meta?: Record<string, unknown>;
  /** a string indicating which URI query parameter caused the error. */
  parameter?: string;
  /** the HTTP status code applicable to this problem, expressed as a string value. */
  status?: number;
  /** a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization. */
  title: string;
};

export type JsonApiErrorResponse = {
  errors: JsonApiError[];
  success: false;
};

export type JsonApiResponseMeta = {
  meta?: {
    cacheHit?: boolean;
  } & Record<string, Record<string, unknown> | boolean | number | string>;
};

export type JsonApiSuccessResponse<T> = {
  data: T;
  success: true;
} & JsonApiResponseMeta;

export type JsonApiResponse<T> =
  | JsonApiErrorResponse
  | JsonApiSuccessResponse<T>;
