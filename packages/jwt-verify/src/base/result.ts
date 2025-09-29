export interface SuccessResult<TData extends Record<string, unknown>> {
  data: TData;
  error: undefined;
}
export interface FailureResult<TError extends Error> {
  error: TError;
  data: undefined;
}

export type Result<
  TData extends Record<string, unknown>,
  TError extends Error,
> = SuccessResult<TData> | FailureResult<TError>;

export const success = <T extends Record<string, unknown>>(
  data: T
): SuccessResult<T> => {
  return { data, error: undefined };
};

export const fail = <T extends Error>(error: T): FailureResult<T> => {
  return { data: undefined, error };
};
