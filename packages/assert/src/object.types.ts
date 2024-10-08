import type {
  BasePlainObject,
  DefaultBasePlainObject,
  PlainObjectDeepPartialUnknown,
  PlainObjectKey,
} from './object.internal.types';
import type { Simplify } from './types/internal.types';

export type PlainObject<
  TValue extends BasePlainObject = DefaultBasePlainObject,
> = TValue extends DefaultBasePlainObject
  ? Record<PlainObjectKey, unknown>
  : Simplify<PlainObjectDeepPartialUnknown<TValue>>;
