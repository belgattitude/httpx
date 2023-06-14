/**
 * Supported native ecmascript errors
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types
 * @see https://262.ecma-international.org/12.0/#sec-well-known-intrinsic-objects
 */
import type { HttpMethod } from '../../types/HttpMethod';

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

export type NativeErrorFields = {
  /** Class name, ie: Error, RangeError, HttpException, HttpBadRequest */
  name: string;
  /** Error message (a string, non-empty with HttpException subclasses) */
  message: string;
  stack?: string;
  cause?: Serializable;
};

export type HttpExceptionFields = NativeErrorFields & {
  statusCode: number;
  url?: string;
  method?: HttpMethod;
  errorId?: string;
  code?: string;
};

export type Serializable =
  | ({
      __type: 'NonNativeError';
    } & NativeErrorFields)
  | ({
      __type: 'NativeError';
    } & NativeErrorFields)
  | ({
      __type: 'HttpException';
    } & HttpExceptionFields);

export type SerializableHttpException =
  DiscriminateSerializable<'HttpException'>;

export type SerializableError = DiscriminateSerializable<'NativeError'>;

export type SerializableNonNativeError =
  DiscriminateSerializable<'NonNativeError'>;
