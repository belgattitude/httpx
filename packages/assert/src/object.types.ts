export type PlainObjectDeepPartialUnknown<T> = {
  [P in keyof T]?: T[P] extends object
    ? PlainObjectDeepPartialUnknown<T[P]>
    : unknown;
};

export type PlainObject<
  TValue extends Record<string, unknown> = Record<string, unknown>,
> = PlainObjectDeepPartialUnknown<TValue>;
