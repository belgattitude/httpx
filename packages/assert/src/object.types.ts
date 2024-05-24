import type {
  BasePlainObject,
  PlainObjectDeepPartialUnknown,
  PlainObjectKey,
  UnspecifiedPlainObjectType,
} from './object.internal.types';
import type { Simplify } from './types/internal.types';

export type PlainObject<
  TValue extends BasePlainObject = UnspecifiedPlainObjectType,
> = TValue extends UnspecifiedPlainObjectType
  ? Record<PlainObjectKey, unknown>
  : Simplify<PlainObjectDeepPartialUnknown<TValue>>;
