import type { Simplify } from './types/internal.types';

export type PlainObjectKey = string | number | symbol;

export type BasePlainObject = Record<PlainObjectKey, unknown>;

export interface DefaultBasePlainObject extends BasePlainObject {
  readonly __tag: 'default-plain-object';
}

export type PlainObjectDeepPartialUnknown<T> = {
  [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject
    ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>>
    : unknown;
};
