export const createAssertException = (
  msgOrErrorFactory?: string | (() => Error),
  fallbackMsg?: string
) => {
  if (
    typeof msgOrErrorFactory === 'string' ||
    msgOrErrorFactory === undefined
  ) {
    throw new Error(
      msgOrErrorFactory ?? fallbackMsg ?? 'Assertion did not pass.'
    );
  }
  throw msgOrErrorFactory();
};
