import type { WeakOpaqueContainer } from './types/opaque.types';

export type StringNonEmpty = string & WeakOpaqueContainer<'StringNonEmpty'>;
export type ParsableSafeInt = string & WeakOpaqueContainer<'ParsableSafeInt'>;
export type ParsableStrictIsoDateZ = string &
  WeakOpaqueContainer<'ParsableStrictIsoDateZ'>;
