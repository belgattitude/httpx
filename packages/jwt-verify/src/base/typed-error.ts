export interface TypedError {
  readonly type: string;
}

export type Class<T, Arguments extends unknown[] = never[]> = {
  prototype: Pick<T, keyof T>;
  new (...arguments_: Arguments): T;
};

export const isTypedError = (error: unknown): error is TypedError => {
  return (
    error instanceof Error &&
    typeof (error as unknown as TypedError)?.type === 'string'
  );
};

export const createHasInstance = (
  type: string,
  nativeErrorClass: Class<Error | TypeError>
): ((value: unknown) => boolean) => {
  return (value: unknown) => {
    return (
      value instanceof nativeErrorClass &&
      'type' in value &&
      (value as TypedError).type === type
    );
  };
};
