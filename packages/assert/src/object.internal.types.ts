import type { Simplify } from './types/internal.types';

export type PlainObjectKey = string;

export type UnspecifiedPlainObjectType = BasePlainObject & {
  readonly __httpxInternalTag: '@httpx/PlainObject';
};

export type BasePlainObject = Record<PlainObjectKey, unknown>;

export type PlainObjectDeepPartialUnknown<T> = {
  [P in keyof T]?: NonNullable<T[P]> extends BasePlainObject
    ? Simplify<PlainObjectDeepPartialUnknown<NonNullable<T[P]>>>
    : unknown;
};
