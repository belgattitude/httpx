export type PlainObjectDeepPartialUnknown<T> = {
  [P in keyof T]?: NonNullable<T[P]> extends Record<string, unknown>
    ? PlainObjectDeepPartialUnknown<NonNullable<T[P]>>
    : unknown;
};

export type PlainObject<
  TValue extends Record<string, unknown> = Record<string, unknown>,
> = PlainObjectDeepPartialUnknown<TValue>;
