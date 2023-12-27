export type PlainObject<
  T = unknown,
  K extends number | string = string,
> = Record<K, T>;
