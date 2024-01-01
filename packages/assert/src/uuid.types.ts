import type { WeakOpaqueContainer } from './types/opaque.types';

export type Uuid = string & WeakOpaqueContainer<'Uuid'>;

export type UuidV1 = string & WeakOpaqueContainer<'UuidV1'>;
export type UuidV3 = string & WeakOpaqueContainer<'UuidV3'>;
export type UuidV4 = string & WeakOpaqueContainer<'UuidV4'>;
export type UuidV5 = string & WeakOpaqueContainer<'UuidV5'>;

export type UuidVersion = 1 | 3 | 4 | 5;
export type UuidVersionOrNumber =
  | UuidVersion
  // This allows to get typings for versions while keeping
  // the freedom to pass an arbitrary number
  // (this trick might be removed by future versions of typescript)
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (number & {});
