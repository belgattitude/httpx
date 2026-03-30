/**
 * @throws TypeError
 */
export const createAssertException = (
  msgOrErrorFactory?: string | (() => Error),
  fallbackMsg?: string
): TypeError | Error => {
  if (
    typeof msgOrErrorFactory === 'string' ||
    msgOrErrorFactory === undefined
  ) {
    return new TypeError(
      msgOrErrorFactory ?? fallbackMsg ?? 'Assertion did not pass.'
    );
  }
  return msgOrErrorFactory();
};
