import type { WeakOpaqueContainer } from './types/opaque.types';

export type NumberSafeInt = number & WeakOpaqueContainer<'NumberSafeInt'>;
