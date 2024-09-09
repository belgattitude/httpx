export type MsgOrErrorFactory = string | (() => Error);

/**
 * @credits https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts
 */
export type Simplify<T> = {
  [KeyType in keyof T]: T[KeyType];
  // eslint-disable-next-line sonarjs/no-useless-intersection
} & NonNullable<unknown>;
