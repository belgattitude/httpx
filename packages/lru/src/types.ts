export type BaseCacheKeyTypes = string | number;
export type Milliseconds = number;
type PositiveNumberGreaterThanZero = number;
export type EpochTimeInMilliseconds = PositiveNumberGreaterThanZero;

export interface LruCacheHasOptions {
  /**
   * If true, the item will be marked as recently used.
   * @default option touchOnHas in the constructor
   */
  touch?: boolean;
}

type BaseCacheValueTypes =
  | string
  | number
  | bigint
  | boolean
  | null
  | unknown[]
  // objects or functions, but not promises
  | (object & { then?: void })
  | Record<string | number | symbol, unknown>;

export type SupportedCacheValues =
  | Readonly<BaseCacheValueTypes>
  | BaseCacheValueTypes;
