import type { WeakOpaqueContainer } from './types/opaque.types';

export type Uuid = string & WeakOpaqueContainer<'Uuid'>;

export type UuidV1 = string & WeakOpaqueContainer<'UuidV1'>;
export type UuidV3 = string & WeakOpaqueContainer<'UuidV3'>;
export type UuidV4 = string & WeakOpaqueContainer<'UuidV4'>;
export type UuidV5 = string & WeakOpaqueContainer<'UuidV5'>;
export type UuidV7 = string & WeakOpaqueContainer<'UuidV7'>;

export type UuidVersion = 1 | 3 | 4 | 5 | 7;
export type UuidVersionOrNumber = number &
  WeakOpaqueContainer<'UuidVersionOrNumber'>;
