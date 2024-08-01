import type {
  BasePlainObject,
  DefaultBasePlainObject,
  PlainObjectDeepPartialUnknown,
  PlainObjectKey,
  Simplify,
} from './internal.types';

export type PlainObject<
  TValue extends BasePlainObject = DefaultBasePlainObject,
> = TValue extends DefaultBasePlainObject
  ? Record<PlainObjectKey, unknown>
  : Simplify<PlainObjectDeepPartialUnknown<TValue>>;
