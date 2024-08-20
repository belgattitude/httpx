/**
 * Supported native ecmascript errors
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types
 * @see https://262.ecma-international.org/12.0/#sec-well-known-intrinsic-objects
 */
import type { HttpErrorStatusCodeOrNumber } from '../../types/HttpErrorStatusCodeOrNumber';
import type { HttpMethod } from '../../types/HttpMethod';
import type { HttpValidationIssue } from '../../types/HttpValidationIssue';

export type NativeError =
  | Error
  | EvalError
  | RangeError
  | ReferenceError
  | SyntaxError
  | TypeError
  | URIError;

type DiscriminateSerializable<T extends Serializable['__type']> = Extract<
  Serializable,
  { __type: T }
>;

export type SerializerParams = {
  /**
   * Whether to include stack strack trace in serialized data
   */
  includeStack?: boolean | undefined;
};

export type NativeErrorFields = {
  cause?: Serializable;
  /** Error message (a string, non-empty with HttpException subclasses) */
  message: string;
  /** Class name, ie: Error, RangeError, HttpException, HttpBadRequest */
  name: string;
  stack?: string | undefined;
};

export type HttpExceptionFields = NativeErrorFields & {
  code?: string | undefined;
  errorId?: string | undefined;
  issues?: HttpValidationIssue[] | undefined;
  method?: HttpMethod | undefined;
  statusCode: HttpErrorStatusCodeOrNumber;
  url?: string | undefined;
};

export type Serializable =
  | ({
      __type: 'HttpException';
    } & HttpExceptionFields)
  | ({
      __type: 'NativeError';
    } & NativeErrorFields)
  | ({
      __type: 'NonNativeError';
    } & NativeErrorFields);

export type SerializableHttpException =
  DiscriminateSerializable<'HttpException'>;

export type SerializableError = DiscriminateSerializable<'NativeError'>;

export type SerializableNonNativeError =
  DiscriminateSerializable<'NonNativeError'>;
