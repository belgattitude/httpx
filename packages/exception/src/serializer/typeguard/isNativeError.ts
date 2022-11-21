/**
 * Native ecmascript errors
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types
 * @see https://262.ecma-international.org/12.0/#sec-well-known-intrinsic-objects
 */
import type { NativeError } from '../types';

export const nativeErrorMap = {
  Error: Error,
  EvalError: EvalError,
  RangeError: RangeError,
  ReferenceError: ReferenceError,
  SyntaxError: SyntaxError,
  TypeError: TypeError,
  UriError: URIError,
};

export const nativeErrors = Object.values(nativeErrorMap);

export const isNativeError = (error: Error): error is NativeError => {
  if (!((error as unknown) instanceof Error)) {
    return false;
  }
  for (const e of nativeErrors) {
    if (error.name === e.name) {
      return true;
    }
  }
  return false;
};
