import type { HttpException } from "../../base";
import { isHttpException } from "../../typeguards/isHttpException";
import type { HttpValidationIssue } from "../../types/HttpValidationIssue";
import { isBrandedAs } from "../../utils/brand";
import { maxCauseDepth } from "../constants";
import { isNativeError } from "../typeguard";
import type { NativeError, Serializable, SerializerParams } from "../types";

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v !== "";

/**
 * Whether the exception is an HttpUnprocessableEntity (or a subclass, from any
 * copy of the same major version) carrying validation issues.
 * Checks the brand rather than `instanceof HttpUnprocessableEntity` to keep
 * the class out of the bundle when unused.
 */
const hasIssues = (
  e: HttpException
): e is HttpException & { issues: HttpValidationIssue[] } =>
  isBrandedAs(e, "HttpUnprocessableEntity") &&
  Array.isArray((e as { issues?: unknown }).issues);

const convert = (
  e: Error | HttpException | NativeError,
  params: SerializerParams | undefined,
  depth: number
): Serializable => {
  const { includeStack = false } = params ?? {};
  const {
    cause: c = null,
    message,
    name,
    stack = null,
  } = (
    (e as unknown) instanceof Error
      ? e
      : {
          message:
            typeof (e as unknown) === "string"
              ? e
              : `Can't serialize error at runtime. Received '${typeof e}'`,
          name: "Error",
        }
  ) as Error;
  const cause =
    c instanceof Error && depth < maxCauseDepth
      ? convert(c, undefined, depth + 1)
      : null;
  const common = {
    message,
    name,
    ...(includeStack && isNonEmptyString(stack) ? { stack } : {}),
    ...(cause ? { cause } : {}),
  };
  if (isHttpException(e)) {
    return {
      __type: "HttpException",
      ...common,
      statusCode: e.statusCode,
      ...(isNonEmptyString(e.url) ? { url: e.url } : {}),
      ...(isNonEmptyString(e.code) ? { code: e.code } : {}),
      ...(isNonEmptyString(e.method) ? { method: e.method } : {}),
      ...(isNonEmptyString(e.errorId) ? { errorId: e.errorId } : {}),
      ...(hasIssues(e) ? { issues: e.issues } : {}),
    };
  }
  return {
    __type: isNativeError(e) ? "NativeError" : "NonNativeError",
    ...common,
  };
};

/**
 * Convert an Error, NativeError or any HttpException to
 * an object suitable for serialization (a serializable version).
 *
 * @see {createFromSerializable}
 */
export const convertToSerializable = (
  e: Error | HttpException | NativeError,
  params?: SerializerParams
): Serializable => convert(e, params, 0);
