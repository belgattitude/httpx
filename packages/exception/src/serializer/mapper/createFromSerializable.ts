import type { HttpException } from "../../base";
import { createHttpException } from "../../factory/createHttpException";
import type { HttpExceptionParamsWithIssues } from "../../types/HttpExceptionParamsWithIssues";
import { maxCauseDepth } from "../constants";
import { SerializerError } from "../error/SerializerError";
import {
  baseExceptionMap,
  isBaseHttpException,
  nativeErrorMap,
} from "../typeguard";
import type {
  NativeError,
  Serializable,
  SerializableError,
  SerializableHttpException,
  SerializableNonNativeError,
  SerializerParams,
} from "../types";

type MaskedUndefinedAsStringTillLibEs5SupportsExactTypes = string;

const isCauseAllowed = (
  cause: Serializable | undefined,
  depth: number
): cause is Serializable => Boolean(cause) && depth < maxCauseDepth;

const createCustomError = (
  serializable: Omit<SerializableError | SerializableNonNativeError, "__type">,
  params: SerializerParams | undefined,
  depth: number
): Error | NativeError => {
  const { includeStack = false } = params ?? {};
  const { cause, message, name, stack } = serializable;
  // own keys only: inherited ones (ie: 'constructor', 'toString') are not error classes
  const cls = Object.hasOwn(nativeErrorMap, name)
    ? nativeErrorMap[name as keyof typeof nativeErrorMap]
    : Error;
  const e: Error | NativeError = isCauseAllowed(cause, depth)
    ? new cls(message, {
        // oxlint-disable-next-line no-use-before-define -- mutual recursion, only called once the module is initialized
        cause: fromSerializable(cause, params, depth + 1),
      })
    : new cls(message);
  if (!includeStack) {
    e.stack =
      undefined as unknown as MaskedUndefinedAsStringTillLibEs5SupportsExactTypes;
  } else if (stack !== undefined) {
    e.stack = stack;
  }
  return e;
};

const createHttpExceptionError = (
  serializable: SerializableHttpException,
  params: SerializerParams | undefined,
  depth: number
): Error | HttpException => {
  const { includeStack = false } = params ?? {};
  const {
    cause,
    name,
    stack,
    statusCode,
    code,
    errorId,
    message,
    method,
    url,
    issues,
  } = serializable;
  const exceptionParams = {
    cause: isCauseAllowed(cause, depth)
      ? // oxlint-disable-next-line no-use-before-define -- mutual recursion, only called once the module is initialized
        fromSerializable(
          cause,
          {
            includeStack,
          },
          depth + 1
        )
      : undefined,
    code,
    errorId,
    message,
    method,
    url,
    ...(issues ? { issues } : {}),
  } satisfies HttpExceptionParamsWithIssues;
  let e: HttpException;
  try {
    e = isBaseHttpException(name)
      ? new baseExceptionMap[name](statusCode, exceptionParams)
      : createHttpException(statusCode, exceptionParams);
  } catch {
    return createCustomError(
      {
        ...(cause ? { cause } : {}),
        message: exceptionParams.message,
        name,
        ...(includeStack ? { stack } : {}),
      },
      {
        includeStack,
      },
      depth
    );
  }
  if (!includeStack) {
    e.stack =
      undefined as unknown as MaskedUndefinedAsStringTillLibEs5SupportsExactTypes;
  } else if (stack !== undefined) {
    e.stack = stack;
  }
  return e;
};

const fromSerializable = (
  payload: Serializable,
  params: SerializerParams | undefined,
  depth: number
): Error | HttpException | NativeError => {
  // payloads usually come from untrusted json: never assume their shape
  const type: unknown =
    typeof payload === "object" && payload !== null
      ? payload.__type
      : undefined;
  switch (type) {
    case "HttpException": {
      return createHttpExceptionError(
        payload as SerializableHttpException,
        params,
        depth
      );
    }
    case "NativeError":
    case "NonNativeError": {
      return createCustomError(payload, params, depth);
    }
    default: {
      throw new SerializerError(
        `Can't unserialize from unknown error (${String(
          (payload as Partial<Serializable> | null)?.name
        )})`
      );
    }
  }
};

/**
 * create an Error, NativeError or any HttpException from a
 * serializable representation.
 *
 * Nested causes deeper than 10 levels are dropped.
 *
 * @throws {SerializerError} when the payload isn't a serializable error
 * @see {convertToSerializable}
 */
export const createFromSerializable = (
  payload: Serializable,
  params?: SerializerParams
): Error | HttpException | NativeError => fromSerializable(payload, params, 0);
