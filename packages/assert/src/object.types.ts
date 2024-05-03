type DeepPartialUnknown<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialUnknown<T[P]> : unknown;
};

export type PlainObject<
  TValue extends Record<string, unknown> = Record<string, unknown>,
> = DeepPartialUnknown<TValue>;
