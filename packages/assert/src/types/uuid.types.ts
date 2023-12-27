export type Uuid = string;

export type UuidV1 = string;
export type UuidV3 = string;
export type UuidV4 = string;
export type UuidV5 = string;

export type UuidVersion = 1 | 3 | 4 | 5;
export type UuidVersionOrNumber =
  | UuidVersion
  // This allows to get typings for versions while keeping
  // the freedom to pass an arbitrary number
  // (this trick might be removed by future versions of typescript)
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (number & {});
