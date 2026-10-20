/**
 * Native ecmascript errors, keyed by their name
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types
 * @see https://262.ecma-international.org/12.0/#sec-well-known-intrinsic-objects
 */
import type { NativeError } from "../types";

export const nativeErrorMap = {
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
};

export const isNativeError = (error: Error): error is NativeError =>
  (error as unknown) instanceof Error &&
  // own keys only: inherited ones (ie: 'constructor', 'toString') are not error classes
  Object.hasOwn(nativeErrorMap, error.name);
