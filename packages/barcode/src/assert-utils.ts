/**
 * Custom message (thrown as a TypeError) or factory returning the error to
 * throw. The factory receives the invalid value (ie: to build a custom
 * message or a http exception).
 */
export type MsgOrErrorFactory = string | ((v: unknown) => Error);

/**
 * Describe a value without leaking its content (type and length only).
 * @internal
 */
export const describeValue = (v: unknown): string => {
  if (v === null) {
    return "null";
  }
  if (typeof v === "string") {
    return `string(length:${v.length})`;
  }
  return Array.isArray(v) ? `array(size:${v.length})` : typeof v;
};

/**
 * @internal
 * @throws TypeError|Error
 */
export const throwAssertError = (
  v: unknown,
  expected: string,
  msgOrErrorFactory?: MsgOrErrorFactory
): never => {
  if (typeof msgOrErrorFactory === "function") {
    throw msgOrErrorFactory(v);
  }
  throw new TypeError(
    msgOrErrorFactory ??
      `Value is expected to be ${expected}, got: ${describeValue(v)}`
  );
};
